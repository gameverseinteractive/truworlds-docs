// Renders one guide page written in the docs' Markdown dialect the way create.truworlds.com does
// (same anchors, links, callouts and code highlighting), and reports what the dialect does not allow.
//
// Every problem is reported twice: as a message in `warnings`, and as { kind, message } in `issues`,
// so validate.mjs can pick the kinds it treats as errors. Kinds: front-matter, title, heading,
// callout, html, image, link, link-style, code, api.
import MarkdownIt from '../vendor/markdown-it.mjs';
import { parse as parseYaml } from '../vendor/yaml.mjs';
import { highlightTruScript } from './truscript-highlight.mjs';

export const GUIDE_PREFIX = '/docs/guides';
const ALERTS = { NOTE: 'Note', TIP: 'Tip', IMPORTANT: 'Important', WARNING: 'Warning', CAUTION: 'Caution' };
const ALLOWED_ALERTS = new Set(['NOTE', 'TIP', 'WARNING']);
const PLACEHOLDER = /^<!--\s*(screenshot|diagram):\s*([\s\S]*?)\s*-->\s*$/i;
const EXAMPLE_PREFIX = 'Example: ';
const NO_IMAGES = 'images are not part of the dialect; use a <!-- screenshot: --> or <!-- diagram: --> placeholder';

export function escapeHtml(s) {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// GitHub-style heading anchors.
export function slugify(source) {
	return source
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[`*]/g, '')
		.replace(/\\</g, '<')
		.toLowerCase()
		.trim()
		.replace(/[^\p{L}\p{N}\s_-]/gu, '')
		.replace(/\s/g, '-');
}

function reporter() {
	const warnings = [];
	const issues = [];
	const warn = (kind, message) => {
		warnings.push(message);
		issues.push({ kind, message });
	};
	return { warnings, issues, warn };
}

function readFrontMatter(text, warn) {
	const src = text.replace(/\r\n/g, '\n');
	const m = /^---\n([\s\S]*?)\n---\n?/.exec(src);
	if (!m) {
		warn('front-matter', 'no front matter');
		return { meta: {}, body: src };
	}
	let meta = {};
	try {
		meta = parseYaml(m[1]) ?? {};
	} catch (e) {
		warn('front-matter', 'front matter is not valid YAML: ' + e.message.split('\n')[0]);
	}
	if (typeof meta !== 'object' || Array.isArray(meta)) {
		warn('front-matter', 'front matter is not a list of keys');
		meta = {};
	}
	for (const key of Object.keys(meta)) {
		if (key !== 'title' && key !== 'description') warn('front-matter', 'front matter key "' + key + '" is not allowed (only title and description)');
	}
	return { meta, body: src.slice(m[0].length) };
}

export function splitFrontMatter(text) {
	const { warnings, warn } = reporter();
	const { meta, body } = readFrontMatter(text, warn);
	return { meta, body, warnings };
}

function md() {
	return new MarkdownIt({ html: true, linkify: false, typographer: false });
}

function uniqueSlug(base, seen) {
	const n = seen.get(base) ?? 0;
	seen.set(base, n + 1);
	return n ? base + '-' + n : base;
}

// Every heading id on a page, deduplicated the way the renderer does it.
export function collectAnchors(text) {
	const { body } = splitFrontMatter(text);
	const ids = new Set();
	const seen = new Map();
	const tokens = md().parse(body, {});
	let first = true;
	for (let i = 0; i < tokens.length; i++) {
		if (tokens[i].type !== 'heading_open') continue;
		const titleHeading = first && tokens[i].tag === 'h1';
		first = false;
		if (!titleHeading) ids.add(uniqueSlug(slugify(tokens[i + 1].content), seen));
	}
	return ids;
}

function normalizePath(path) {
	const out = [];
	for (const seg of path.split('/')) {
		if (seg === '..') out.pop();
		else if (seg !== '.' && seg !== '') out.push(seg);
	}
	return out.join('/');
}

function highlightedFence(code) {
	return '<pre class="highlight ts-code"><code>' + highlightTruScript(code) + '</code></pre>\n';
}

// The fences of an example file, for checking it has exactly one ```truscript block.
export function exampleFences(text) {
	const { body } = splitFrontMatter(text);
	return md()
		.parse(body, {})
		.filter((t) => t.type === 'fence' || t.type === 'code_block')
		.map((t) => (t.type === 'fence' ? t.info.trim().split(/\s+/)[0] : ''));
}

export function renderExample(text) {
	const { body } = splitFrontMatter(text);
	const fence = md()
		.parse(body, {})
		.find((t) => t.type === 'fence');
	return fence ? highlightedFence(fence.content) : '';
}

// ctx: { pagePath: 'physics/raycasting', guidePrefix?: '/docs/guides',
//        resolveApi(target) -> { url, warning? }, pageExists(path) -> bool, anchorsOf(path) -> Set | null }
// options.placeholders: 'hide' renders <!-- screenshot: ... --> and <!-- diagram: ... --> as nothing,
// as the site does; 'show' renders them as labeled boxes.
export function renderPage(text, ctx, options = {}) {
	const showPlaceholders = options.placeholders === 'show';
	const prefix = ctx.guidePrefix ?? GUIDE_PREFIX;
	const { warnings, issues, warn } = reporter();
	const { meta, body } = readFrontMatter(text, warn);
	const engine = md();
	const tokens = engine.parse(body, {});
	const toc = [];
	const anchors = new Set();
	const seen = new Map();
	const hidden = new Set();
	const alerts = new Map();
	let title = typeof meta.title === 'string' ? meta.title : '';
	let firstH1Dropped = false;
	const examples = new Set();

	for (let i = 0; i < tokens.length; i++) {
		const t = tokens[i];
		if (t.type === 'heading_open') {
			const inline = tokens[i + 1];
			const level = Number(t.tag.slice(1));
			if (level === 1) {
				if (!firstH1Dropped && toc.length === 0) {
					firstH1Dropped = true;
					if (!title) title = inline.content;
					else if (inline.content !== title) warn('title', 'the # heading "' + inline.content + '" does not match the front matter title "' + title + '"');
					hidden.add(t).add(inline).add(tokens[i + 2]);
					inline.children = [];
					continue;
				}
				warn('heading', 'extra # heading "' + inline.content + '" (a page has one title)');
			}
			if (level > 3) warn('heading', 'heading level ' + level + ' "' + inline.content + '" (pages use ## and ### only)');
			const id = uniqueSlug(slugify(inline.content), seen);
			t.attrSet('id', id);
			anchors.add(id);
			if (level === 2 || level === 3) toc.push({ id, label: (inline.children ?? []).map((c) => c.content).join(''), depth: level - 1 });
			// "## Example: A paint pad" is a worked example: its section is framed and the heading carries a label.
			const first = inline.children?.[0];
			if (level === 2 && first?.type === 'text' && first.content.startsWith(EXAMPLE_PREFIX)) {
				examples.add(t);
				first.content = first.content.slice(EXAMPLE_PREFIX.length);
			}
		} else if (t.type === 'blockquote_open') {
			markAlert(tokens, i, warn, hidden, alerts);
		}
	}
	if (!firstH1Dropped) warn('heading', 'no # title heading after the front matter');

	const rules = engine.renderer.rules;
	let inExample = false;
	rules.heading_open = (toks, idx) => {
		if (hidden.has(toks[idx])) return '';
		const id = toks[idx].attrGet('id') ?? '';
		const example = examples.has(toks[idx]);
		let before = '';
		if (toks[idx].tag === 'h2') {
			if (inExample) before += '</section>\n';
			inExample = example;
			if (example) before += '<section class="example">\n';
		}
		return before + '<' + toks[idx].tag + ' id="' + escapeHtml(id) + '"' + (example ? ' class="example"' : '') + '><a class="link" href="#' + escapeHtml(id) + '">' +
			(example ? '<span class="example-label">Example</span>' : '');
	};
	rules.heading_close = (toks, idx) => (hidden.has(toks[idx]) ? '' : '</a></' + toks[idx].tag + '>\n');
	rules.blockquote_open = (toks, idx, opts, _env, self) => {
		const alert = alerts.get(toks[idx]);
		if (!alert) return self.renderToken(toks, idx, opts);
		return '<div class="admonitionblock ' + alert.toLowerCase() + '"><div class="title">' + ALERTS[alert] + '</div>\n';
	};
	rules.blockquote_close = (toks, idx, opts, _env, self) => (alerts.has(toks[idx]) ? '</div>\n' : self.renderToken(toks, idx, opts));
	rules.paragraph_open = (toks, idx, opts, _env, self) => (hidden.has(toks[idx]) ? '' : self.renderToken(toks, idx, opts));
	rules.paragraph_close = (toks, idx, opts, _env, self) => (hidden.has(toks[idx]) ? '' : self.renderToken(toks, idx, opts));
	rules.fence = (toks, idx) => {
		const t = toks[idx];
		const lang = t.info.trim().split(/\s+/)[0];
		if (lang === 'truscript') return highlightedFence(t.content);
		if (!lang) warn('code', 'code block without a language (samples use ```truscript)');
		return '<pre class="highlight"><code>' + escapeHtml(t.content) + '</code></pre>\n';
	};
	rules.code_block = (toks, idx) => {
		warn('code', 'indented code block (use a ```truscript fence)');
		return '<pre class="highlight"><code>' + escapeHtml(toks[idx].content) + '</code></pre>\n';
	};
	rules.html_block = (toks, idx) => rawHtml(toks[idx].content, warn, true, showPlaceholders);
	rules.html_inline = (toks, idx) => rawHtml(toks[idx].content, warn, false, showPlaceholders);
	rules.image = () => {
		warn('image', NO_IMAGES);
		return '';
	};
	rules.link_open = (toks, idx, opts, _env, self) => {
		const t = toks[idx];
		const { url, cls } = rewriteLink(t.attrGet('href') ?? '', ctx, prefix, warn);
		t.attrSet('href', url);
		if (cls) t.attrJoin('class', cls);
		if (cls === 'external') {
			t.attrSet('target', '_blank');
			t.attrSet('rel', 'noopener noreferrer');
		}
		return self.renderToken(toks, idx, opts);
	};

	// Same-page anchors are checked after rendering, once every heading id is known.
	const html = engine.renderer.render(tokens, engine.options, {}) + (inExample ? '</section>\n' : '');
	for (const missing of pendingSelfAnchors(html, anchors)) warn('link', 'link to #' + missing + ' on this page: no such heading');

	if (!title) warn('front-matter', 'page has no title');
	if (typeof meta.description !== 'string' || !meta.description) warn('front-matter', 'front matter has no description');
	return { title, description: typeof meta.description === 'string' ? meta.description : '', html, toc, anchors, warnings, issues };
}

function pendingSelfAnchors(html, anchors) {
	const out = [];
	for (const m of html.matchAll(/<a href="#([^"]+)"/g)) {
		const id = safeDecode(m[1]) ?? m[1];
		if (!anchors.has(id)) out.push(id);
	}
	return [...new Set(out)];
}

function markAlert(tokens, i, warn, hidden, alerts) {
	const para = tokens[i + 1];
	const inline = tokens[i + 2];
	if (para?.type !== 'paragraph_open' || inline?.type !== 'inline') return;
	const m = /^\[!([A-Z]+)\][ \t]*(\n|$)/.exec(inline.content);
	if (!m) {
		if (/^\[![A-Z]+\]/.test(inline.content)) warn('callout', 'callout marker must be alone on its line: ' + inline.content.split('\n')[0].slice(0, 60));
		return;
	}
	const kind = m[1];
	if (!ALERTS[kind]) {
		warn('callout', 'unknown callout [!' + kind + ']');
		return;
	}
	if (!ALLOWED_ALERTS.has(kind)) warn('callout', 'callout [!' + kind + '] (the dialect allows NOTE, TIP and WARNING)');
	alerts.set(tokens[i], kind);
	let depth = 0;
	for (let j = i; j < tokens.length; j++) {
		if (tokens[j].type === 'blockquote_open') depth++;
		else if (tokens[j].type === 'blockquote_close' && --depth === 0) {
			alerts.set(tokens[j], kind);
			break;
		}
	}
	inline.content = inline.content.slice(m[0].length);
	const kids = inline.children ?? [];
	kids[0].content = kids[0].content.replace(/^\[![A-Z]+\][ \t]*/, '');
	if (kids[0].content === '') {
		kids.shift();
		if (kids[0]?.type === 'softbreak' || kids[0]?.type === 'hardbreak') kids.shift();
	}
	if (kids.length === 0) hidden.add(para).add(tokens[i + 3]);
}

function rawHtml(content, warn, block, showPlaceholders) {
	const trimmed = content.trim();
	const placeholder = PLACEHOLDER.exec(trimmed);
	if (placeholder) {
		if (!showPlaceholders) return '';
		const kind = placeholder[1].toLowerCase();
		const label = kind === 'screenshot' ? 'Screenshot' : 'Diagram';
		const tag = block ? 'figure' : 'span';
		return '<' + tag + ' class="placeholder ' + kind + '"><span class="kind">' + label + '</span> ' + escapeHtml(placeholder[2]) + '</' + tag + '>' + (block ? '\n' : '');
	}
	if (/^<!--[\s\S]*-->$/.test(trimmed)) {
		warn('html', 'HTML comment that is not a screenshot or diagram placeholder: ' + trimmed.slice(0, 60));
		return '';
	}
	warn('html', 'raw HTML is not part of the dialect: ' + trimmed.slice(0, 60));
	return escapeHtml(content);
}

// decodeURIComponent, or null for a malformed % escape.
function safeDecode(s) {
	try {
		return decodeURIComponent(s);
	} catch {
		return null;
	}
}

function rewriteLink(href, ctx, prefix, warn) {
	const decode = (s) => {
		const out = safeDecode(s);
		if (out === null) warn('link', 'link with a malformed % escape: ' + href);
		return out ?? s;
	};
	if (href.startsWith('api:')) {
		const { url, warning } = ctx.resolveApi(decode(href.slice(4)));
		if (warning) warn('api', warning);
		return { url, cls: 'api' };
	}
	if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
		if (!/^https?:/i.test(href)) warn('link-style', 'link with scheme ' + href.split(':')[0] + ': ' + href);
		return { url: href, cls: 'external' };
	}
	if (href.startsWith('#')) return { url: href };
	const hashAt = href.indexOf('#');
	const pathPart = decode(hashAt < 0 ? href : href.slice(0, hashAt));
	const hash = hashAt < 0 ? '' : decode(href.slice(hashAt + 1));
	if (!pathPart.endsWith('.md')) warn('link-style', 'page link without .md: ' + href);
	const dir = ctx.pagePath.includes('/') ? ctx.pagePath.slice(0, ctx.pagePath.lastIndexOf('/')) : '';
	const target = normalizePath(dir + '/' + pathPart).replace(/\.md$/, '');
	if (!ctx.pageExists(target)) warn('link', 'link to ' + target + ': page not in the page list');
	else if (hash) {
		const targetAnchors = ctx.anchorsOf(target);
		if (targetAnchors && !targetAnchors.has(hash)) warn('link', 'link to ' + target + '#' + hash + ': no such heading');
		if (!targetAnchors) warn('link-style', 'link to ' + target + '#' + hash + ': page not written yet, anchor unchecked');
	}
	// A section's index page is the section's own URL, as on the site.
	const route = target.replace(/(^|\/)index$/, '');
	return { url: prefix + (route ? '/' + route : '') + (hash ? '#' + encodeURIComponent(hash) : '') };
}
