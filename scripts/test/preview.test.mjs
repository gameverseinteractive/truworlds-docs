import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// preview.mjs starts its server on import, so this reads its source instead of running it.
const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'preview.mjs'), 'utf8');

test('the preview listens on the loopback interface only', () => {
	assert.match(source, /server\.listen\(PORT, '127\.0\.0\.1',/);
});
