import { test } from 'node:test';
import assert from 'node:assert/strict';
import { thumbnailFor, IMAGE_TYPES } from '../lib/thumbnails.mjs';

test('the preview serves the image types the site serves', () => {
	assert.deepEqual(IMAGE_TYPES, { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' });
});

test('thumbnails are webp then png only, as on the site', () => {
	const has = (files) => (p) => files.includes(p);
	assert.equal(thumbnailFor('physics/raycasting', has(['physics/raycasting.jpg', 'physics/raycasting.png'])), 'physics/raycasting.png');
	assert.equal(thumbnailFor('physics/raycasting', has(['physics/raycasting.webp', 'physics/raycasting.png'])), 'physics/raycasting.webp');
	assert.equal(thumbnailFor('physics/raycasting', has(['physics/raycasting.jpg', 'default.jpeg'])), null);
	assert.equal(thumbnailFor('physics/raycasting', has(['default.png'])), 'default.png');
});
