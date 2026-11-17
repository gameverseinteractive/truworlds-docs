import { test } from 'node:test';
import assert from 'node:assert/strict';
import { collectAnchors, renderPage, renderExample, slugify } from '../lib/render.mjs';

const pages = new Map([
	['physics/raycasting', null],
	['physics/index', new Set(['raycasts'])],
	['scripting/signals', new Set(['waiting'])]
]);

const ctx = (pagePath = 'physics/raycasting', extra = {}) => ({
	pagePath,
	resolveApi: (target) => ({ url: '/docs/classes/' + target.replace('.', '#fn-') }),
	pageExists: (path) => pages.has(path),
	anchorsOf: (path) => pages.get(path) ?? null,
	...extra
});
const page = (body) => '---\ntitle: Raycasting\ndescription: Ask what lies along a line\n---\n\n# Raycasting\n\n' + body;

test('title heading is dropped and front matter wins', () => {
	const r = renderPage(page('Text.\n'), ctx());
	assert.ok(!r.html.includes('<h1'));
	assert.equal(r.title, 'Raycasting');
	assert.equal(r.description, 'Ask what lies along a line');
	assert.deepEqual(r.warnings, []);
});

test('h2 and h3 get ids, self-links and toc entries; dedupe', () => {
	const r = renderPage(page('## Hit results\n\n### Details\n\n## Hit results\n'), ctx());
	assert.ok(r.html.includes('<h2 id="hit-results"><a class="link" href="#hit-results">'));
	assert.deepEqual(r.toc.map((t) => [t.id, t.depth]), [['hit-results', 1], ['details', 2], ['hit-results-1', 1]]);
	assert.deepEqual([...collectAnchors(page('## Example\n\n## Example\n'))], ['example', 'example-1']);
	assert.deepEqual(r.warnings, []);
});

test('callouts', () => {
	const r = renderPage(page('> [!TIP]\n> Text\n\n> Plain quote.\n'), ctx());
	assert.ok(r.html.includes('<div class="admonitionblock tip"><div class="title">Tip</div>'));
	assert.ok(r.html.includes('<blockquote>'));
	assert.match(renderPage(page('> [!CAUTION]\n> Hot.\n'), ctx()).warnings.join(), /allows NOTE, TIP and WARNING/);
});

test('placeholders render as nothing by default and with hide', () => {
	const src = page('<!-- diagram: a ray drawn as arrow -->\n\nInline <!-- screenshot: the hit marker --> here.\n');
	for (const r of [renderPage(src, ctx()), renderPage(src, ctx(), { placeholders: 'hide' })]) {
		assert.ok(!r.html.includes('placeholder'));
		assert.ok(!r.html.includes('arrow'));
		assert.ok(!r.html.includes('marker'));
		assert.deepEqual(r.warnings, []);
	}
});

test('placeholders show as labeled boxes with show', () => {
	const r = renderPage(page('<!-- diagram: a ray drawn as arrow -->\n'), ctx(), { placeholders: 'show' });
	assert.ok(r.html.includes('<figure class="placeholder diagram"><span class="kind">Diagram</span> a ray drawn as arrow</figure>'));
	assert.deepEqual(r.warnings, []);
});

test('links', () => {
	assert.ok(renderPage(page('[S](../scripting/signals.md#waiting)\n'), ctx()).html.includes('href="/docs/guides/scripting/signals#waiting"'));
	assert.ok(renderPage(page('[P](../physics/index.md#raycasts)\n'), ctx()).html.includes('href="/docs/guides/physics#raycasts"'));
	assert.ok(renderPage(page('[Part](api:Part.Anchored)\n'), ctx()).html.includes('<a href="/docs/classes/Part#fn-Anchored" class="api">'));
	assert.ok(renderPage(page('[Site](https://example.com/a)\n'), ctx()).html.includes('<a href="https://example.com/a" class="external" target="_blank" rel="noopener noreferrer">'));
	const w = renderPage(page('[a](../scripting/nope.md) [b](../scripting/signals.md#missing) [c](#absent)\n'), ctx()).warnings.join('\n');
	assert.match(w, /link to scripting\/nope: page not in the page list/);
	assert.match(w, /link to scripting\/signals#missing: no such heading/);
	assert.match(w, /link to #absent on this page: no such heading/);
});

test('crlf input renders the same', () => {
	const lf = page('## Hit\n\n> [!NOTE]\n> Hi\n\n```truscript\nlocal a = 1\n```\n');
	assert.equal(renderPage(lf.replace(/\n/g, '\r\n'), ctx()).html, renderPage(lf, ctx()).html);
});

test('slugify matches the GitHub-style rule', () => {
	assert.equal(slugify('RaycastAll: every `hit` [x](y)'), 'raycastall-every-hit-x');
});

test('renderExample highlights a single fence', () => {
	const html = renderExample('```truscript\nlocal a = 1\n```\n');
	assert.ok(html.includes('<pre class="highlight ts-code"><code>'));
	assert.ok(html.includes('ts-keyword'));
});

test('images are not part of the dialect: warned and rendered as nothing', () => {
	for (const src of ['![a ray](ray.webp)\n', 'See ![x](https://example.com/x.png) here.\n']) {
		const r = renderPage(page(src), ctx());
		assert.ok(!r.html.includes('<img'), r.html);
		assert.ok(!r.html.includes('ray.webp') && !r.html.includes('example.com'), r.html);
		assert.ok(r.issues.some((i) => i.kind === 'image' && /images are not part of the dialect; use a <!-- screenshot: --> or <!-- diagram: --> placeholder/.test(i.message)), JSON.stringify(r.issues));
	}
});

test('a malformed % escape in a link is a link problem, not a crash', () => {
	for (const href of ['%E0%A4%A.md', '../scripting/signals.md#%E0%A4%A', 'api:Part.%E0%A4%A', '#%E0%A4%A']) {
		const r = renderPage(page('[bad](' + href + ')\n'), ctx());
		assert.ok(r.issues.some((i) => i.kind === 'link'), href + ': ' + JSON.stringify(r.issues));
	}
	assert.match(renderPage(page('[bad](%E0%A4%A.md)\n'), ctx()).warnings.join('\n'), /malformed % escape: %E0%A4%25A\.md/);
});

test('an extra # heading or a missing # title is a heading problem', () => {
	assert.ok(renderPage(page('# Again\n'), ctx()).issues.some((i) => i.kind === 'heading' && /extra # heading "Again"/.test(i.message)));
	const noTitle = renderPage('---\ntitle: Raycasting\ndescription: Ask what lies along a line\n---\n\nText.\n', ctx());
	assert.ok(noTitle.issues.some((i) => i.kind === 'heading' && /no # title heading/.test(i.message)));
	const mismatch = renderPage('---\ntitle: Raycasting\ndescription: Ask what lies along a line\n---\n\n# Raycasts\n', ctx());
	assert.deepEqual(mismatch.issues.map((i) => i.kind), ['title']);
});

test('a root page links to a section page', () => {
	const r = renderPage(page('[c](engine/cmatrix.md)\n'), ctx('glossary', { pageExists: (p) => p === 'engine/cmatrix' }));
	assert.match(r.html, /href="\/docs\/guides\/engine\/cmatrix"/);
	assert.deepEqual(r.warnings, []);
});

test('a section page links to a root page', () => {
	const r = renderPage(page('[g](../glossary.md)\n'), ctx('engine/x', { pageExists: (p) => p === 'glossary' }));
	assert.match(r.html, /href="\/docs\/guides\/glossary"/);
	assert.deepEqual(r.warnings, []);
});
