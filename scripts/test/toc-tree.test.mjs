import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '../vendor/yaml.mjs';
import { parseToc } from '../lib/toc-tree.mjs';

const fixtures = join(dirname(fileURLToPath(import.meta.url)), 'fixtures');

test('the parser matches the shared golden fixture', () => {
	const value = parse(readFileSync(join(fixtures, 'toc-parity.yaml'), 'utf-8'));
	const golden = JSON.parse(readFileSync(join(fixtures, 'toc-parity.json'), 'utf-8'));
	assert.deepEqual(parseToc(value), golden);
});
