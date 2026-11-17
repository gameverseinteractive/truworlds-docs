#!/usr/bin/env node
// Local preview of the guides, laid out like create.truworlds.com/docs/guides.
//
//   node scripts/preview.mjs [--port 4321] [--root <repo>]
//
// Reads content/guides and its toc.yaml. Pages render on every request and the browser reloads
// when a file changes. Screenshot and diagram placeholders show as labeled boxes (the site hides
// them), and a banner lists the page's problems, including everything `node scripts/validate.mjs`
// would fail on. api: links point at the class page on create.truworlds.com.
// Thumbnails go beside the pages: <section>/<page>.webp, <section>/index.webp for a section,
// index.webp for the landing, default.webp as a fallback up the folders (.png also works).
// Crops match the site: 5:1 banner, centered 2:1 card.
import { createServer } from 'node:http';
import { readFileSync, statSync, existsSync, watch } from 'node:fs';
import { join, dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { escapeHtml as esc, GUIDE_PREFIX as GUIDES } from './lib/render.mjs';
import { thumbnailFor, IMAGE_TYPES } from './lib/thumbnails.mjs';
import { listSections } from './lib/toc-tree.mjs';
import { navHtml, cardItems, crumbTrail, pagerLinks } from './lib/preview-nav.mjs';
import { loadGuides, checkPage, structureErrors, guideFile, TOC_FILE } from './validate.mjs';

function arg(name, fallback) {
	const i = process.argv.indexOf('--' + name);
	if (i < 0) return fallback;
	if (i + 1 >= process.argv.length) { console.error('preview: --' + name + ' needs a value'); process.exit(2); }
	return process.argv[i + 1];
}

const ROOT = resolve(arg('root', join(dirname(fileURLToPath(import.meta.url)), '..')));
const CONTENT = join(ROOT, 'content', 'guides');
const PORT = Number(arg('port', process.env.PORT)) || 4321;
const RENDER = { placeholders: 'show' };

// ----- content -----

// Entries whose page file is missing are left out of the nav. A section whose own page has no file
// stays when something under it is written, and says so on its page.
function withFiles(entries, texts) {
	const kept = [];
	for (const e of entries) {
		if (e.kind === 'page') {
			if (texts.has(e.path)) kept.push(e);
			continue;
		}
		const children = withFiles(e.entries, texts);
		if (texts.has(e.index.path) || children.length) kept.push({ ...e, entries: children });
	}
	return kept;
}

// The nav from toc.yaml, keeping the pages that have a file. A written page that is not in the toc
// stays out of the nav and is still served at its URL, with the "not in toc" notice (the site ignores it).
function buildSite() {
	const guides = loadGuides(ROOT);
	const entries = withFiles(guides.entries, guides.texts);
	const sections = new Map(listSections(entries).map((s) => [s.path, s]));
	return { ...guides, entries, sections, structure: structureErrors(guides) };
}

// ----- pages -----

function sidebar(site, activePath) {
	return '<p class="label">Guides</p><input class="filter" type="search" placeholder="Filter by title">' +
		'<nav><div class="row"><span class="spacer"></span><a href="' + GUIDES + '"' + (activePath === '' ? ' class="active"' : '') + '>Guides</a></div>' +
		navHtml(site.entries, activePath, GUIDES) + '</nav>';
}

// Thumbnails are served where the site serves them. The ?v= stamp makes a re-exported image show on reload.
function thumb(pagePath) {
	const rel = thumbnailFor(pagePath, (p) => existsSync(join(CONTENT, p)));
	return rel ? GUIDES + '/assets/' + rel + '?v=' + Math.round(statSync(join(CONTENT, rel)).mtimeMs) : null;
}

function banner(url) {
	return url ? '<img class="banner" src="' + esc(url) + '" alt="" decoding="async">' : '';
}

function cards(items) {
	return '<div class="cards">' + items.map((i) => '<a class="card" href="' + i.href + '">' +
		(i.thumb ? '<img src="' + esc(i.thumb) + '" alt="" loading="lazy" decoding="async">' : '') +
		'<div class="body' + (i.thumb ? ' under-image' : '') + '"><div class="t">' + esc(i.title) + '</div>' +
		(i.description ? '<p class="d">' + esc(i.description) + '</p>' : '') + '</div></a>').join('') + '</div>';
}

const pagerHtml = ({ prev, next }) => (prev || next) ? '<nav class="pager" aria-label="Previous and next page">' +
	(prev ? '<a class="prev" href="' + GUIDES + '/' + esc(prev.path) + '"><span class="dir">&larr; Previous</span><span class="t">' + esc(prev.title) + '</span></a>' : '<span></span>') +
	(next ? '<a class="next" href="' + GUIDES + '/' + esc(next.path) + '"><span class="dir">Next &rarr;</span><span class="t">' + esc(next.title) + '</span></a>' : '') + '</nav>' : '';
const pageCards = (entries) => cards(cardItems(entries).map((i) => ({ href: GUIDES + '/' + i.href, title: i.title, description: i.description, thumb: thumb(i.thumbPath) })));

function crumbs(trail) {
	return '<nav class="crumbs">' + trail.map((c, i) => (i === trail.length - 1
		? '<span class="current">' + esc(c.title) + '</span>'
		: '<a href="' + c.href + '">' + esc(c.title) + '</a><span>/</span>')).join('') + '</nav>';
}

// Validation errors first, then what only the preview points out.
function problems(errors, notes) {
	const total = errors.length + notes.length;
	if (!total) return '';
	return '<details class="problems" open><summary>' +
		(errors.length ? errors.length + ' validate error' + (errors.length > 1 ? 's' : '') : '') +
		(errors.length && notes.length ? ', ' : '') +
		(notes.length ? notes.length + ' preview warning' + (notes.length > 1 ? 's' : '') : '') +
		'</summary><ul>' +
		errors.map((w) => '<li><strong>' + esc(w) + '</strong></li>').join('') +
		notes.map((w) => '<li>' + esc(w) + '</li>').join('') + '</ul></details>';
}

// Renders a guide page with its problems, each prefixed with the file it is in.
function renderGuide(site, path) {
	const file = guideFile(path);
	const { doc, errors } = checkPage(site, path, RENDER);
	const errorSet = new Set(errors);
	const allErrors = [...(site.structure.get(path) ?? []), ...errors];
	return {
		doc,
		errors: allErrors.map((e) => file + ': ' + e),
		notes: [...new Set(doc.warnings)].filter((w) => !errorSet.has(w)).map((w) => file + ': ' + w)
	};
}

function header(doc) {
	return '<h1>' + esc(doc.title) + '</h1>' + (doc.description ? '<p class="description">' + esc(doc.description) + '</p>' : '');
}

// The landing renders content/guides/index.md, then the section cards. It also lists pages that are
// missing from the toc or listed without a file, since they have no page of their own to show it on.
function landing(site) {
	const elsewhere = [...site.structure].filter(([path]) => path !== 'index').flatMap(([path, list]) => list.map((e) => guideFile(path) + ': ' + e));
	let intro = { title: 'Guides', html: '<h1>Guides</h1>', toc: [], errors: (site.structure.get('index') ?? []).map((e) => guideFile('index') + ': ' + e), notes: [] };
	if (site.texts.has('index')) {
		const r = renderGuide(site, 'index');
		intro = { title: r.doc.title, html: header(r.doc) + r.doc.html, toc: r.doc.toc, errors: r.errors, notes: r.notes };
	}
	return {
		title: intro.title,
		errors: [...intro.errors, ...elsewhere],
		notes: intro.notes,
		toc: intro.toc,
		body: banner(thumb('index')) + '<div class="adoc">' + intro.html + '</div>' +
			pageCards(site.entries)
	};
}

function sectionPage(site, section) {
	if (site.texts.has(section.index.path)) {
		const view = articlePage(site, section.index.path);
		return { ...view, body: view.body + pageCards(section.entries), pager: pagerHtml(pagerLinks(section.path, site.entries)) };
	}
	return {
		title: section.title,
		errors: [],
		notes: [section.index.path + '.md: no section page, so the site leaves this section out'],
		body: crumbs(sectionCrumbs(site, section.path, section.title)) + banner(thumb(section.index.path)) + '<div class="adoc"><h1>' + esc(section.title) + '</h1></div>' +
			pageCards(section.entries)
	};
}

function sectionCrumbs(site, path, title) {
	return [{ href: GUIDES, title: 'Guides' },
		...crumbTrail(path, site.entries).map((c) => ({ href: GUIDES + '/' + c.path, title: c.title })),
		{ title }];
}

function articlePage(site, path) {
	const { doc, errors, notes } = renderGuide(site, path);
	return {
		title: doc.title,
		errors,
		notes,
		toc: doc.toc,
		pager: pagerHtml(pagerLinks(path, site.entries)),
		body: crumbs(sectionCrumbs(site, path, doc.title)) +
			banner(thumb(path)) + '<div class="adoc">' + header(doc) + doc.html + '</div>'
	};
}

function page(urlPath) {
	const site = buildSite();
	const rel = urlPath.slice(GUIDES.length).replace(/^\/+|\/+$/g, '');
	let view;
	let status = 200;
	const sectionOfIndex = site.sections.get(rel.slice(0, -'/index'.length));
	if (rel === '') view = landing(site);
	else if (site.sections.has(rel)) view = sectionPage(site, site.sections.get(rel));
	else if (rel.endsWith('/index') && sectionOfIndex) return { status: 302, location: GUIDES + '/' + sectionOfIndex.path };
	else if (rel !== 'index' && site.texts.has(rel)) view = articlePage(site, rel);
	else {
		status = 404;
		view = { title: 'Not found', body: '<div class="adoc"><h1>Page not found</h1><p>' + esc(urlPath) + ' has no page in content/guides.</p></div>' };
	}
	const errors = [...site.tocErrors.map((e) => TOC_FILE + ': ' + e), ...(view.errors ?? [])];
	const toc = view.toc ?? [];
	return {
		status,
		html: SHELL(view.title,
			'<div class="layout"><aside class="sidebar">' + sidebar(site, rel) + '</aside>' +
			'<div class="main"><article class="article">' + problems(errors, view.notes ?? []) + view.body + (view.pager ?? '') + '</article>' +
			(toc.length ? '<aside class="toc"><p class="label" style="padding:0">On this page</p><nav>' +
				toc.map((t) => '<a href="#' + esc(t.id) + '" style="padding-left:' + (t.depth - 1) * 12 + 'px">' + esc(t.label) + '</a>').join('') + '</nav></aside>' : '') +
			'</div></div>')
	};
}

// ----- server -----

const clients = new Set();
let debounce;
const notify = () => {
	clearTimeout(debounce);
	debounce = setTimeout(() => { for (const res of clients) res.write('data: change\n\n'); }, 100);
};
if (existsSync(CONTENT)) watch(CONTENT, { recursive: true }, notify);

const server = createServer((req, res) => {
	let path;
	try {
		path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
	} catch {
		res.writeHead(400, { 'Content-Type': 'text/plain' }).end('Bad request');
		return;
	}
	if (path === '/' || path === '/docs' || path === '/docs/') res.writeHead(302, { Location: GUIDES }).end();
	else if (path === '/__events') {
		res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive' });
		res.write(': connected\n\n');
		clients.add(res);
		req.on('close', () => clients.delete(res));
	} else if (path === GUIDES || (path.startsWith(GUIDES + '/') && !path.startsWith(GUIDES + '/assets/'))) {
		let result;
		try {
			result = page(path);
		} catch (e) {
			result = { status: 500, html: '<pre>' + esc(String(e?.stack ?? e)) + '</pre>' };
		}
		const { status, html, location } = result;
		if (location) res.writeHead(status, { Location: location }).end();
		else res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }).end(html);
	} else if (path.startsWith(GUIDES + '/assets/')) {
		const rel = path.slice((GUIDES + '/assets/').length);
		const file = resolve(CONTENT, rel);
		const type = IMAGE_TYPES[rel.slice(rel.lastIndexOf('.')).toLowerCase()];
		if (type && file.startsWith(CONTENT + sep) && existsSync(file)) res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' }).end(readFileSync(file));
		else res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
	} else if (path === '/favicon.ico') res.writeHead(204).end();
	else res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
});

server.listen(PORT, '127.0.0.1', () => {
	console.log('docs preview: http://127.0.0.1:' + PORT + GUIDES);
});

// ----- page shell. Styles mirror the site's guide rules. -----

const CSS = String.raw`
:root {
	--background: oklch(0.98 0 0); --foreground: oklch(0.145 0 0); --card: oklch(1 0 0);
	--muted: oklch(0.96 0 0); --muted-foreground: oklch(0.556 0 0); --border: oklch(0.9 0 0);
	--warn-bg: #fff7e0; --warn-fg: #7a5200; --warn-border: #f0d48a;
	--tip: #2f9e62; --note: #3b82f6; --warning: #d97706; --example: #0b9468;
	color-scheme: light;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
	--background: #0b0c10; --foreground: oklch(0.985 0 0); --card: #0f1117;
	--muted: oklch(0.269 0 0); --muted-foreground: oklch(0.85 0 0); --border: oklch(1 0 0 / 10%);
	--warn-bg: #2a2310; --warn-fg: #f0d48a; --warn-border: #5a4a1a; --example: #31FFB2; color-scheme: dark;
} }
:root[data-theme="dark"] {
	--background: #0b0c10; --foreground: oklch(0.985 0 0); --card: #0f1117;
	--muted: oklch(0.269 0 0); --muted-foreground: oklch(0.85 0 0); --border: oklch(1 0 0 / 10%);
	--warn-bg: #2a2310; --warn-fg: #f0d48a; --warn-border: #5a4a1a; --example: #31FFB2; color-scheme: dark;
}
* { box-sizing: border-box; border-color: var(--border); }
body { margin: 0; background: var(--background); color: var(--foreground); font-family: ui-sans-serif, system-ui, sans-serif; }
a { color: inherit; }
.layout { display: flex; align-items: flex-start; gap: 1.5rem; padding: 2rem 2.5rem; }
.sidebar { position: sticky; top: 0; height: 100vh; width: 16rem; flex-shrink: 0; overflow-y: auto; border-right: 1px solid var(--border); padding: 0.5rem 0.75rem 2rem 0; font-size: 0.875rem; }
.main { flex: 1; min-width: 0; padding: 0.5rem 0; display: flex; gap: 1.5rem; align-items: flex-start; }
.article { flex: 1; min-width: 0; }
.toc { position: sticky; top: 0; width: 11rem; flex-shrink: 0; max-height: 100vh; overflow-y: auto; padding-top: 0.5rem; display: none; }
@media (min-width: 1280px) { .toc { display: flex; flex-direction: column; } }
@media (max-width: 767px) { .sidebar { display: none; } .layout { padding: 1.5rem 1rem; } }
.label { font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground); margin: 0 0 0.75rem; padding: 0.25rem 0.5rem 0; }
.toc a { display: block; padding: 0.25rem 0; font-size: 0.875rem; color: var(--muted-foreground); text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.toc a:hover { color: var(--foreground); }
.filter { width: calc(100% - 0.75rem); margin: 0 0.375rem 0.5rem; padding: 0.25rem 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem; background: transparent; color: var(--foreground); font: inherit; }
.row { display: flex; align-items: center; }
.row a { flex: 1; min-width: 0; padding: 0.25rem 0.375rem; border-radius: 0.375rem; color: var(--muted-foreground); text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.row a:hover, .row a.active { background: var(--muted); color: var(--foreground); }
.row a.active { font-weight: 500; }
details.group > summary { list-style: none; cursor: pointer; } details.group > summary::-webkit-details-marker { display: none; }
.caret { width: 1.25rem; height: 1.25rem; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; color: var(--muted-foreground); font-size: 0.6rem; transition: transform 120ms; }
details.group[open] > summary .caret { transform: rotate(90deg); }
.spacer { width: 1.25rem; flex-shrink: 0; }
.crumbs { display: flex; flex-wrap: wrap; gap: 0.375rem; font-size: 0.875rem; color: var(--muted-foreground); margin-bottom: 1rem; }
.crumbs a { text-decoration: none; } .crumbs a:hover { color: var(--foreground); }
.crumbs .current { color: var(--foreground); }
.cards { display: grid; gap: 1rem; margin-top: 1.5rem; }
@media (min-width: 640px) { .cards { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1280px) { .cards { grid-template-columns: repeat(3, 1fr); } }
.card { display: flex; flex-direction: column; overflow: hidden; border-radius: 0.75rem; border: 1px solid color-mix(in oklab, var(--foreground) 10%, transparent); background: var(--card); text-decoration: none; transition: all 150ms; }
.card:hover { transform: translateY(-2px); border-color: color-mix(in oklab, var(--foreground) 25%, transparent); }
.card img { display: block; width: 100%; aspect-ratio: 2 / 1; object-fit: cover; }
.card .body { padding: 1rem; }
.card .body.under-image { border-top: 1px solid color-mix(in oklab, var(--foreground) 10%, transparent); }
.banner { display: block; width: 100%; aspect-ratio: 5 / 1; object-fit: cover; border-radius: 0.75rem; border: 1px solid color-mix(in oklab, var(--foreground) 10%, transparent); margin-bottom: 1.5rem; }
.card .t { font-weight: 600; letter-spacing: -0.01em; }
.card .d { margin: 0.25rem 0 0; font-size: 0.75rem; color: color-mix(in oklab, var(--foreground) 55%, transparent); }
.problems { border: 1px solid var(--warn-border); background: var(--warn-bg); color: var(--warn-fg); border-radius: 0.5rem; padding: 0.5rem 0.75rem; margin-bottom: 1.25rem; font-size: 0.8rem; }
.problems summary { font-weight: 600; } .problems ul { margin: 0.5rem 0 0; padding-left: 1.25rem; }
.chrome { position: fixed; right: 0.75rem; bottom: 0.75rem; display: flex; gap: 0.5rem; align-items: center; font-size: 0.75rem; color: var(--muted-foreground); }
.chrome button { border: 1px solid var(--border); background: var(--card); color: var(--foreground); border-radius: 0.375rem; padding: 0.25rem 0.5rem; cursor: pointer; font: inherit; }

/* --- the site's guide body rules, mapped onto Markdown output --- */
.adoc h1, .adoc h2, .adoc h3, .adoc h4 { color: var(--foreground); font-weight: 600; line-height: 1.3; margin-top: 1.75rem; margin-bottom: 0.5rem; scroll-margin-top: 1rem; }
.adoc h1 { font-size: 1.875rem; margin-top: 0; }
.adoc p.description { color: var(--muted-foreground); font-weight: 300; font-size: 1.15rem; line-height: 1.6; margin: -0.25rem 0 1.5rem; }
.adoc h2 { font-size: 1.4rem; border-bottom: 1px solid var(--border); padding-bottom: 0.2rem; }
.adoc h3 { font-size: 1.25rem; line-height: 1.5; }
.adoc p { color: var(--muted-foreground); line-height: 1.75; margin-top: 0; margin-bottom: 1rem; }
.adoc strong { color: var(--foreground); font-weight: 600; }
.adoc a { color: var(--foreground); text-decoration: underline; text-underline-offset: 2px; }
.adoc a:hover { text-decoration: none; }
.adoc :is(h1, h2, h3, h4) a.link { color: inherit; text-decoration: none; }
.adoc code { font-family: ui-monospace, monospace; font-size: 1em; background: var(--muted); color: var(--foreground); padding: 0.15em 0.35em; border-radius: 0.25rem; }
.adoc a code { text-decoration: inherit; }
.adoc pre { background: var(--muted); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1rem 1.25rem; overflow-x: auto; font-family: ui-monospace, monospace; font-size: 0.85rem; line-height: 1.6; color: var(--foreground); margin: 0 0 1rem; }
.adoc pre code { background: none; padding: 0; }
.adoc pre.ts-code { background: #121319; color: #DCDBEE; border-color: #1e2029; }
.adoc pre.ts-code code { color: inherit; }
.adoc pre.ts-code span { text-overflow: ellipsis; word-break: break-word; white-space: pre-wrap; }
.ts-code .ts-comment { color: #61A661; } .ts-code .ts-string { color: #E3CE7B; } .ts-code .ts-number { color: #8FDB88; }
.ts-code .ts-keyword { color: #E17D80; } .ts-code .ts-directive { color: #917BF0; } .ts-code .ts-global { color: #94E0D9; }
.ts-code .ts-constructor { color: #F0AFD7; } .ts-code .ts-function { color: #C2AEEF; } .ts-code .ts-table-member { color: #98BFE3; }
.ts-code .ts-type-ref { color: #66B8FF; }
.adoc ul { list-style: disc; } .adoc ol { list-style: decimal; }
.adoc li::marker { color: var(--muted-foreground); }
.adoc ul, .adoc ol { padding-left: 1.5rem; margin: 0 0 1rem; color: var(--muted-foreground); }
.adoc li { margin-bottom: 0.25rem; line-height: 1.75; }
.adoc li p { margin: 0; }
.adoc blockquote { margin: 0 0 1rem; padding: 0.25rem 1rem; border-left: 3px solid var(--border); }
.adoc .admonitionblock { border-left: 3px solid var(--border); padding: 0.75rem 1rem; margin-bottom: 1rem; border-radius: 0 0.5rem 0.5rem 0; background: var(--muted); }
.adoc .admonitionblock.note { border-left-color: var(--note); } .adoc .admonitionblock.tip { border-left-color: var(--tip); } .adoc .admonitionblock.warning { border-left-color: var(--warning); }
.adoc .admonitionblock .title { font-weight: 600; color: var(--foreground); margin-bottom: 0.25rem; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
.adoc .admonitionblock > :last-child { margin-bottom: 0; }
.adoc table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; font-size: 0.875rem; }
.adoc th, .adoc td { border: 1px solid var(--border); padding: 0.5rem 0.75rem; color: var(--muted-foreground); text-align: left; vertical-align: top; }
.adoc th { background: var(--muted); color: var(--foreground); font-weight: 500; }
/* An "Example: " section: a tinted frame, with an "Example" tab sitting on its top edge. */
.adoc section.example { position: relative; margin: 2.25rem 0 1.75rem; padding: 0.25rem 1.25rem; border: 1px solid color-mix(in oklab, var(--example) 35%, transparent); border-radius: 0.75rem; background: color-mix(in oklab, var(--example) 4%, transparent); }
.adoc h2.example { margin-top: 1.25rem; border-bottom: none; scroll-margin-top: 3.25rem; }
.adoc .example-label { position: absolute; top: 0; left: 1rem; transform: translateY(-50%); font-size: 0.8rem; font-weight: 500; line-height: 1.5; padding: 0 0.65rem; color: var(--example); border: 1px solid color-mix(in oklab, var(--example) 35%, transparent); border-radius: 999px; background: var(--background); }
.pager { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border); }
.pager a { display: flex; flex-direction: column; gap: 0.25rem; padding: 0.875rem 1rem; border-radius: 0.75rem; border: 1px solid color-mix(in oklab, var(--foreground) 10%, transparent); background: var(--card); text-decoration: none; transition: all 150ms; }
.pager a:hover { border-color: color-mix(in oklab, var(--foreground) 25%, transparent); transform: translateY(-1px); }
.pager a.next { text-align: right; grid-column: 2; }
.pager .dir { font-size: 0.75rem; color: var(--muted-foreground); }
.pager .t { font-weight: 600; letter-spacing: -0.01em; }
@media (min-width: 640px) {
	.pager { display: flex; justify-content: space-between; align-items: stretch; }
	.pager a { min-width: 12rem; max-width: 50%; }
	.pager a.next { margin-left: auto; }
}
.adoc .placeholder { display: block; margin: 0 0 1rem; padding: 1.25rem 1rem; border: 1px dashed color-mix(in oklab, var(--foreground) 30%, transparent); border-radius: 0.75rem; color: var(--muted-foreground); font-size: 0.85rem; line-height: 1.6; }
.adoc .placeholder .kind { display: block; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem; color: var(--foreground); margin-bottom: 0.25rem; }
`;

const CLIENT = String.raw`
const root = document.documentElement;
try { if (localStorage.getItem('theme')) root.dataset.theme = localStorage.getItem('theme'); } catch {}
document.getElementById('theme').addEventListener('click', () => {
	const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
	root.dataset.theme = dark ? 'light' : 'dark';
	try { localStorage.setItem('theme', root.dataset.theme); } catch {}
});
const filter = document.querySelector('.filter');
filter?.addEventListener('input', () => {
	const q = filter.value.trim().toLowerCase();
	const matches = (row) => !q || row.textContent.toLowerCase().includes(q);
	for (const row of document.querySelectorAll('nav > .row:not(:first-child)')) row.style.display = matches(row) ? '' : 'none';
	for (const group of [...document.querySelectorAll('details.group')].reverse()) {
		let any = false;
		for (const row of group.querySelectorAll(':scope > .row')) {
			const hit = matches(row);
			row.style.display = hit ? '' : 'none';
			any ||= hit;
		}
		for (const inner of group.querySelectorAll(':scope > details.group')) any ||= inner.style.display !== 'none';
		group.style.display = any ? '' : 'none';
		if (q) group.open = any;
	}
});
const key = 'preview-scroll:' + location.pathname;
const saved = sessionStorage.getItem(key);
if (saved !== null) { sessionStorage.removeItem(key); window.scrollTo(0, Number(saved)); }
new EventSource('/__events').onmessage = () => { sessionStorage.setItem(key, String(window.scrollY)); location.reload(); };
`;

const SHELL = (title, app) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} (preview)</title>
<style>${CSS}</style>
</head>
<body>
<div id="app">${app}</div>
<div class="chrome"><span>Markdown preview</span><button id="theme" type="button">Theme</button></div>
<script type="module">${CLIENT}</script>
</body>
</html>`;
