import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPage } from '../lib/render.mjs';

// The site's renderer is tested against the same fixture pair, so the two renderers stay in step.
// api: links resolve against the site's schema there and by a guess here; both tests inject the
// same resolveApi stub (target -> /docs/classes/<Class>#<member>) so the golden HTML is the same.
const dir = join(dirname(fileURLToPath(import.meta.url)), 'fixtures');
const read = (name) => readFileSync(join(dir, name), 'utf8').replace(/\r\n/g, '\n');

const anchors = new Map([
	['physics/raycasting', null],
	['physics/index', new Set()],
	['scripting/signals', new Set(['waiting'])]
]);
const ctx = {
	pagePath: 'physics/raycasting',
	resolveApi: (target) => ({ url: '/docs/classes/' + target.replace('.', '#') }),
	pageExists: (path) => anchors.has(path),
	anchorsOf: (path) => anchors.get(path) ?? null
};

test('the parity page renders to the shared golden HTML', () => {
	const r = renderPage(read('parity-page.md'), ctx);
	assert.deepEqual(r.warnings, []);
	assert.equal(r.html, read('parity-page.html'));
});
