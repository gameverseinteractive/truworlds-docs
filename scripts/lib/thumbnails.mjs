// Thumbnail lookup, as create.truworlds.com/docs/guides does it: a page's own image beside its
// .md file, else the nearest default image up the folders. WebP wins over PNG.
const EXTS = ['.webp', '.png'];

// dir: folder segments relative to the content root; base: the page's file name without .md.
// exists(relPath) -> bool. Returns the relative path of the image, or null.
export function findThumbnail(dir, base, exists) {
	for (const ext of EXTS) {
		const own = [...dir, base + ext].join('/');
		if (exists(own)) return own;
	}
	for (let i = dir.length; i >= 0; i--) {
		for (const ext of EXTS) {
			const fallback = [...dir.slice(0, i), 'default' + ext].join('/');
			if (exists(fallback)) return fallback;
		}
	}
	return null;
}

// The thumbnail for a page path such as 'physics/raycasting' or a section's 'physics/index'.
export function thumbnailFor(pagePath, exists) {
	const segs = pagePath.split('/');
	return findThumbnail(segs.slice(0, -1), segs.at(-1), exists);
}

// The images the site serves from the guides folder. Thumbnails are only ever .webp or .png.
export const IMAGE_TYPES = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
