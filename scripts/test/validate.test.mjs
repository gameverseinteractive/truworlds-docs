import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validate } from '../validate.mjs';

const VALIDATE = join(dirname(fileURLToPath(import.meta.url)), '..', 'validate.mjs');

const TOC = `- section: engine
  title: Engine concepts
  pages:
    - path: engine/index
      title: Engine concepts
      description: How a world is made
    - path: engine/tree
      title: The instance tree
      description: Finding instances
`;

const page = (title, description, body) => `---\ntitle: ${title}\ndescription: ${description}\n---\n\n# ${title}\n\n${body}`;

const CLEAN = {
	'content/guides/toc.yaml': TOC,
	'content/guides/index.md': page('Guides', 'All the guides', 'Start with [the engine](engine/index.md).\n'),
	'content/guides/engine/index.md': page('Engine concepts', 'How a world is made', 'Read [the tree](tree.md#finding-things).\n\n> [!TIP]\n> A tip.\n\n<!-- screenshot: the explorer -->\n'),
	'content/guides/engine/tree.md': page('The instance tree', 'Finding instances', '## Finding things\n\n### Details\n\nSee [Part](api:Part.Anchored) and [here](#details).\n\n```truscript\nlocal a = 1\n```\n'),
	'content/examples/Part/Touched.md': '```truscript\nlocal a = 1\n```\n'
};

function fixture(changes = {}) {
	const root = mkdtempSync(join(tmpdir(), 'docs-validate-'));
	for (const [rel, text] of Object.entries({ ...CLEAN, ...changes })) {
		if (text === null) continue;
		mkdirSync(dirname(join(root, rel)), { recursive: true });
		writeFileSync(join(root, rel), text);
	}
	return root;
}

function errorsFor(changes) {
	const root = fixture(changes);
	try {
		return validate(root);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
}

function expectError(errors, file, pattern) {
	assert.ok(errors.some((e) => e.startsWith(file + ': ') && pattern.test(e)), 'expected an error for ' + file + ' matching ' + pattern + ', got:\n' + errors.join('\n'));
}

test('clean content passes', () => {
	assert.deepEqual(errorsFor({}), []);
});

test('missing page file', () => {
	expectError(errorsFor({ 'content/guides/engine/tree.md': null, 'content/guides/engine/index.md': page('Engine concepts', 'How a world is made', 'Text.\n') }), 'content/guides/engine/tree.md', /listed in content\/guides\/toc\.yaml but missing/);
});

test('stray page', () => {
	expectError(errorsFor({ 'content/guides/engine/stray.md': page('Stray', 'Not listed', 'Text.\n') }), 'content/guides/engine/stray.md', /not in content\/guides\/toc\.yaml/);
});

test('root index.md is required and exempt from the toc', () => {
	assert.ok(!errorsFor({}).some((e) => e.includes('index.md: not in')));
	expectError(errorsFor({ 'content/guides/index.md': null }), 'content/guides/index.md', /missing/);
});

test('title differs from toc', () => {
	const errors = errorsFor({ 'content/guides/engine/tree.md': page('The tree', 'Finding instances', 'Text.\n') });
	expectError(errors, 'content/guides/engine/tree.md', /title "The tree" differs from toc\.yaml "The instance tree"/);
});

test('description differs from toc', () => {
	expectError(errorsFor({ 'content/guides/engine/tree.md': page('The instance tree', 'Something else', 'Text.\n') }), 'content/guides/engine/tree.md', /description/);
});

test('front matter missing or with extra keys', () => {
	expectError(errorsFor({ 'content/guides/engine/tree.md': '# The instance tree\n\nText.\n' }), 'content/guides/engine/tree.md', /no front matter/);
	expectError(errorsFor({ 'content/guides/engine/tree.md': '---\ntitle: The instance tree\ndescription: Finding instances\nweight: 3\n---\n\n# The instance tree\n' }), 'content/guides/engine/tree.md', /key "weight" is not allowed/);
});

test('broken anchor', () => {
	const errors = errorsFor({ 'content/guides/engine/index.md': page('Engine concepts', 'How a world is made', '[a](tree.md#nope) [b](#absent) [c](missing.md)\n') });
	expectError(errors, 'content/guides/engine/index.md', /link to engine\/tree#nope: no such heading/);
	expectError(errors, 'content/guides/engine/index.md', /link to #absent on this page: no such heading/);
	expectError(errors, 'content/guides/engine/index.md', /link to engine\/missing: page not in the page list/);
});

test('raw html', () => {
	const errors = errorsFor({ 'content/guides/engine/tree.md': page('The instance tree', 'Finding instances', '<div>hi</div>\n\nInline <b>bold</b>.\n\n<!-- a note to self -->\n') });
	expectError(errors, 'content/guides/engine/tree.md', /raw HTML is not part of the dialect: <div>/);
	expectError(errors, 'content/guides/engine/tree.md', /raw HTML is not part of the dialect: <b>/);
	expectError(errors, 'content/guides/engine/tree.md', /HTML comment that is not a screenshot or diagram placeholder/);
});

test('heading deeper than ###', () => {
	expectError(errorsFor({ 'content/guides/engine/tree.md': page('The instance tree', 'Finding instances', '## A\n\n### B\n\n#### C\n') }), 'content/guides/engine/tree.md', /heading level 4/);
});

test('callout other than NOTE, TIP and WARNING', () => {
	expectError(errorsFor({ 'content/guides/engine/tree.md': page('The instance tree', 'Finding instances', '> [!CAUTION]\n> Hot.\n') }), 'content/guides/engine/tree.md', /callout \[!CAUTION\]/);
	expectError(errorsFor({ 'content/guides/engine/tree.md': page('The instance tree', 'Finding instances', '> [!DANGER]\n> Hot.\n') }), 'content/guides/engine/tree.md', /unknown callout \[!DANGER\]/);
});

test('bad example', () => {
	const two = '```truscript\na = 1\n```\n\n```truscript\nb = 2\n```\n';
	expectError(errorsFor({ 'content/examples/Part/Touched.md': two }), 'content/examples/Part/Touched.md', /exactly one ```truscript fence/);
	expectError(errorsFor({ 'content/examples/Part/Touched.md': 'Just text.\n' }), 'content/examples/Part/Touched.md', /exactly one ```truscript fence/);
	expectError(errorsFor({ 'content/examples/Part/Touched.md': '```lua\na = 1\n```\n' }), 'content/examples/Part/Touched.md', /exactly one ```truscript fence/);
});

test('api targets are not checked', () => {
	assert.deepEqual(errorsFor({ 'content/guides/engine/tree.md': page('The instance tree', 'Finding instances', '## Finding things\n\n[x](api:NoSuchClass.Nope)\n') }), []);
});

test('toc paths must start with their section folder', () => {
	const toc = TOC.replace('path: engine/tree', 'path: other/tree');
	expectError(errorsFor({ 'content/guides/toc.yaml': toc, 'content/guides/other/tree.md': page('The instance tree', 'Finding instances', 'Text.\n') }), 'content/guides/toc.yaml', /page "other\/tree": must be "engine\/" and a name/);
});

test('duplicate toc paths and sections', () => {
	const dupPath = TOC + '    - path: engine/tree\n      title: The instance tree\n      description: Finding instances\n';
	expectError(errorsFor({ 'content/guides/toc.yaml': dupPath }), 'content/guides/toc.yaml', /"engine\/tree" is listed more than once/);
	const dupSection = TOC + '- section: engine\n  title: Again\n  pages: []\n';
	expectError(errorsFor({ 'content/guides/toc.yaml': dupSection }), 'content/guides/toc.yaml', /"engine" is listed more than once/);
});

test('a section needs its index page in the toc', () => {
	const toc = TOC.replace(/    - path: engine\/index\n.*\n.*\n/, '');
	expectError(errorsFor({ 'content/guides/toc.yaml': toc, 'content/guides/engine/index.md': null, 'content/guides/index.md': page('Guides', 'All the guides', 'Text.\n') }), 'content/guides/toc.yaml', /section "engine" has no engine\/index page/);
});

test('a root-level page and a nested section pass', () => {
	const toc = TOC + `    - section: engine/deep
      title: Deep
      pages:
        - path: engine/deep/index
          title: Deep
          description: Down here
- { path: glossary, title: Glossary, description: Every term }
`;
	assert.deepEqual(errorsFor({
		'content/guides/toc.yaml': toc,
		'content/guides/glossary.md': page('Glossary', 'Every term', 'Text.\n'),
		'content/guides/engine/deep/index.md': page('Deep', 'Down here', 'Text.\n')
	}), []);
});

test('a page and a section at the same URL clash', () => {
	const toc = TOC + '- { path: engine, title: Engine, description: Same URL }\n';
	expectError(errorsFor({ 'content/guides/toc.yaml': toc, 'content/guides/engine.md': page('Engine', 'Same URL', 'Text.\n') }), 'content/guides/toc.yaml', /"engine" is listed more than once/);
});

test('a root-level page missing from the toc is a stray', () => {
	expectError(errorsFor({ 'content/guides/glossary.md': page('Glossary', 'Every term', 'Text.\n') }), 'content/guides/glossary.md', /not in content\/guides\/toc\.yaml/);
});

test('missing or invalid toc.yaml is an error, not a crash', () => {
	expectError(errorsFor({ 'content/guides/toc.yaml': null }), 'content/guides/toc.yaml', /missing/);
	expectError(errorsFor({ 'content/guides/toc.yaml': '- section: [unclosed\n' }), 'content/guides/toc.yaml', /not valid YAML/);
	expectError(errorsFor({ 'content/guides/toc.yaml': 'section: engine\n' }), 'content/guides/toc.yaml', /list of pages and sections/);
});

test('images in a page fail validation', () => {
	expectError(errorsFor({ 'content/guides/engine/tree.md': page('The instance tree', 'Finding instances', '![x](x.webp)\n') }), 'content/guides/engine/tree.md', /images are not part of the dialect/);
});

test('an extra # heading or a missing # title fails validation', () => {
	expectError(errorsFor({ 'content/guides/engine/tree.md': page('The instance tree', 'Finding instances', '# Second title\n') }), 'content/guides/engine/tree.md', /extra # heading "Second title"/);
	const noTitle = '---\ntitle: The instance tree\ndescription: Finding instances\n---\n\nText.\n';
	expectError(errorsFor({ 'content/guides/engine/tree.md': noTitle }), 'content/guides/engine/tree.md', /no # title heading/);
});

test('a malformed % escape is a link error, not a crash', () => {
	expectError(errorsFor({ 'content/guides/engine/tree.md': page('The instance tree', 'Finding instances', '[bad](%E0%A4%A.md)\n') }), 'content/guides/engine/tree.md', /malformed % escape/);
});

test('only pages, toc.yaml and images up to 1 MB under guides', () => {
	const errors = errorsFor({
		'content/guides/engine/notes.txt': 'x',
		'content/guides/engine/tree.adoc': 'x',
		'content/guides/engine/big.png': 'x'.repeat(1024 * 1024 + 1),
		'content/guides/engine/ok.jpg': 'x',
		'content/guides/engine/ok.JPEG': 'x',
		'content/guides/engine/ok.png': 'x',
		'content/guides/engine/ok.webp': 'x'.repeat(1024 * 1024)
	});
	expectError(errors, 'content/guides/engine/notes.txt', /file type not allowed/);
	expectError(errors, 'content/guides/engine/tree.adoc', /file type not allowed/);
	expectError(errors, 'content/guides/engine/big.png', /over 1024 KB/);
	assert.ok(!errors.some((e) => /ok\.(jpg|JPEG|png|webp)/.test(e)), errors.join('\n'));
	expectError(errorsFor({ 'content/guides/engine/toc.yaml': 'x' }), 'content/guides/engine/toc.yaml', /file type not allowed/);
	expectError(errorsFor({ 'content/guides/engine/notes.MD': 'x' }), 'content/guides/engine/notes.MD', /file type not allowed/);
});

test('only .md files under examples, at examples/<Type>/<Member>.md', () => {
	const fence = '```truscript\na = 1\n```\n';
	expectError(errorsFor({ 'content/examples/Part/picture.png': 'x' }), 'content/examples/Part/picture.png', /file type not allowed/);
	expectError(errorsFor({ 'content/examples/Part/Anchored.MD': fence }), 'content/examples/Part/Anchored.MD', /file type not allowed/);
	expectError(errorsFor({ 'content/examples/Touched.md': fence }), 'content/examples/Touched.md', /examples\/<Type>\/<Member>\.md/);
	expectError(errorsFor({ 'content/examples/Part/Deep/Touched.md': fence }), 'content/examples/Part/Deep/Touched.md', /examples\/<Type>\/<Member>\.md/);
});

test('toc section names and page paths the site can route', () => {
	const sectionToc = (name) => `- section: ${name}\n  title: X\n  pages:\n    - path: ${name}/index\n      title: X\n      description: Y\n`;
	expectError(errorsFor({ 'content/guides/toc.yaml': TOC + sectionToc('Big_Name') }), 'content/guides/toc.yaml', /section "Big_Name"/);
	expectError(errorsFor({ 'content/guides/toc.yaml': TOC + sectionToc('assets') }), 'content/guides/toc.yaml', /"assets": "assets" is taken/);
	expectError(errorsFor({ 'content/guides/toc.yaml': TOC + sectionToc('a/b') }), 'content/guides/toc.yaml', /section "a\/b"/);
	const nested = TOC + '    - path: engine/sub/page\n      title: Deep\n      description: Deep\n';
	expectError(errorsFor({ 'content/guides/toc.yaml': nested, 'content/guides/engine/sub/page.md': page('Deep', 'Deep', 'Text.\n') }), 'content/guides/toc.yaml', /engine\/sub\/page/);
	const upper = TOC + '    - path: engine/Tree_2\n      title: Deep\n      description: Deep\n';
	expectError(errorsFor({ 'content/guides/toc.yaml': upper, 'content/guides/engine/Tree_2.md': page('Deep', 'Deep', 'Text.\n') }), 'content/guides/toc.yaml', /engine\/Tree_2/);
});

test('the CLI exits 1 on errors and 0 on clean content', () => {
	const bad = fixture({ 'content/examples/Part/Touched.md': 'Just text.\n' });
	const good = fixture({});
	try {
		const failed = spawnSync(process.execPath, [VALIDATE, bad], { encoding: 'utf8' });
		assert.equal(failed.status, 1, failed.stdout + failed.stderr);
		assert.match(failed.stderr, /content\/examples\/Part\/Touched\.md: /);
		const passed = spawnSync(process.execPath, [VALIDATE, good], { encoding: 'utf8' });
		assert.equal(passed.status, 0, passed.stdout + passed.stderr);
	} finally {
		rmSync(bad, { recursive: true, force: true });
		rmSync(good, { recursive: true, force: true });
	}
});
