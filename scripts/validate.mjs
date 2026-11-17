#!/usr/bin/env node
// Checks content/ the way create.truworlds.com/docs reads it. Run from anywhere:
//
//   node scripts/validate.mjs [repo-root]
//
// Prints one line per problem, each naming the file, and exits 1 when there are any.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse as parseYaml } from './vendor/yaml.mjs';
import { renderPage, collectAnchors, exampleFences } from './lib/render.mjs';
import { parseToc, listPages, listSections } from './lib/toc-tree.mjs';

export const TOC_FILE = 'content/guides/toc.yaml';
const ROOT_PAGE = 'index';

// The renderer's problem kinds that fail validation. The rest (a # heading that differs from the
// title, a fence without a language, a link without .md) only show in the preview.
export const ERROR_KINDS = new Set(['front-matter', 'heading', 'callout', 'html', 'image', 'link']);

// What publish.yml may bundle: the site reads pages, the toc and images from guides/, and only
// examples/<Type>/<Member>.md from examples/.
const IMAGE_EXTS = new Set(['.webp', '.png', '.jpg', '.jpeg']);
const IMAGE_MAX = 1024 * 1024;

export const guideFile = (path) => 'content/guides/' + path + '.md';

function walk(dir, ext, base = '', out = []) {
	if (!existsSync(dir)) return out;
	for (const name of readdirSync(dir)) {
		const full = join(dir, name);
		const rel = base ? base + '/' + name : name;
		if (statSync(full).isDirectory()) walk(full, ext, rel, out);
		else if (name.endsWith(ext)) out.push(rel);
	}
	return out;
}

function walkAll(dir, base = '', out = []) {
	if (!existsSync(dir)) return out;
	for (const name of readdirSync(dir)) {
		const full = join(dir, name);
		const rel = base ? base + '/' + name : name;
		if (statSync(full).isDirectory()) walkAll(full, rel, out);
		else out.push(rel);
	}
	return out;
}

// Pages must end in .md exactly, as the site reads them; image extensions match in any case.
const extOf = (rel) => (rel.includes('.') ? rel.slice(rel.lastIndexOf('.')).toLowerCase() : '');

function fileErrors(root) {
	const errors = [];
	const guidesDir = join(root, 'content', 'guides');
	for (const rel of walkAll(guidesDir).sort()) {
		if (rel.endsWith('.md') || rel === 'toc.yaml') continue;
		if (!IMAGE_EXTS.has(extOf(rel))) errors.push('content/guides/' + rel + ': file type not allowed in content/guides (pages, toc.yaml and .webp, .png, .jpg images only)');
		else if (statSync(join(guidesDir, rel)).size > IMAGE_MAX) errors.push('content/guides/' + rel + ': image over ' + IMAGE_MAX / 1024 + ' KB');
	}
	for (const rel of walkAll(join(root, 'content', 'examples')).sort()) {
		if (!rel.endsWith('.md')) errors.push('content/examples/' + rel + ': file type not allowed in content/examples (.md only)');
		else if (rel.split('/').length !== 2) errors.push('content/examples/' + rel + ': not at examples/<Type>/<Member>.md (the site ignores it)');
	}
	return errors;
}

function readToc(root) {
	const file = join(root, TOC_FILE);
	if (!existsSync(file)) return { entries: [], errors: ['missing'] };
	let value;
	try {
		value = parseYaml(readFileSync(file, 'utf-8'));
	} catch (e) {
		return { entries: [], errors: ['not valid YAML: ' + e.message.split('\n')[0]] };
	}
	return parseToc(value);
}

// Everything the site reads from content/guides. Shared with the preview.
export function loadGuides(root) {
	const toc = readToc(root);
	const listed = new Map(listPages(toc.entries).map((p) => [p.path, p]));
	const sections = new Map(listSections(toc.entries).map((s) => [s.path, s]));
	const guidesDir = join(root, 'content', 'guides');
	const texts = new Map(walk(guidesDir, '.md').map((rel) => [rel.slice(0, -3), readFileSync(join(guidesDir, rel), 'utf-8')]));
	const anchors = new Map();
	const anchorsOf = (path) => {
		const text = texts.get(path);
		if (text === undefined) return null;
		if (!anchors.has(path)) anchors.set(path, collectAnchors(text));
		return anchors.get(path);
	};
	// As on the site: a link target is a toc page, or the landing.
	const pageExists = (path) => listed.has(path) || (path === ROOT_PAGE && texts.has(ROOT_PAGE));
	return { entries: toc.entries, sections, tocErrors: toc.errors, listed, texts, anchorsOf, pageExists };
}

// api: targets are not checked; without the site's schema they point at the class page.
export const noSchemaApi = (target) => ({ url: 'https://create.truworlds.com/docs/classes/' + target.replace(/^(global|builtin)\//, '').split('.')[0] });

// Renders one guide page; errors are the problems that fail validation, without the file name.
export function checkPage(guides, path, options) {
	const doc = renderPage(guides.texts.get(path), { pagePath: path, resolveApi: noSchemaApi, pageExists: guides.pageExists, anchorsOf: guides.anchorsOf }, options);
	const errors = doc.issues.filter((i) => ERROR_KINDS.has(i.kind)).map((i) => i.message);
	const entry = guides.listed.get(path);
	if (entry && doc.title !== entry.title) errors.push('title "' + doc.title + '" differs from toc.yaml "' + entry.title + '"');
	if (entry && doc.description !== entry.description) errors.push('description "' + doc.description + '" differs from toc.yaml "' + entry.description + '"');
	return { doc, errors: [...new Set(errors)] };
}

// Whole-file problems (a page missing from the toc, or listed but missing), keyed by page path.
export function structureErrors(guides) {
	const byPath = new Map();
	const add = (path, msg) => byPath.set(path, [...(byPath.get(path) ?? []), msg]);
	if (!guides.texts.has(ROOT_PAGE)) add(ROOT_PAGE, 'missing (the landing page of the guides)');
	for (const path of guides.listed.keys()) if (!guides.texts.has(path)) add(path, 'listed in ' + TOC_FILE + ' but missing');
	for (const path of guides.texts.keys()) if (path !== ROOT_PAGE && !guides.listed.has(path)) add(path, 'not in ' + TOC_FILE + ' (the site ignores it)');
	return byPath;
}

export function validate(root) {
	const errors = [];
	const guides = loadGuides(root);
	for (const e of guides.tocErrors) errors.push(TOC_FILE + ': ' + e);
	for (const [path, list] of structureErrors(guides)) for (const e of list) errors.push(guideFile(path) + ': ' + e);
	for (const path of [...guides.texts.keys()].sort()) {
		for (const e of checkPage(guides, path).errors) errors.push(guideFile(path) + ': ' + e);
	}
	errors.push(...fileErrors(root));
	const examplesDir = join(root, 'content', 'examples');
	for (const rel of walk(examplesDir, '.md').sort()) {
		if (rel.split('/').length !== 2) continue;
		const fences = exampleFences(readFileSync(join(examplesDir, rel), 'utf-8'));
		if (fences.length !== 1 || fences[0] !== 'truscript') {
			errors.push('content/examples/' + rel + ': needs exactly one ```truscript fence (found ' + (fences.length ? fences.map((f) => f || 'one without a language').join(', ') : 'none') + ')');
		}
	}
	return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
	const root = resolve(process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), '..'));
	const errors = validate(root);
	if (errors.length) {
		for (const e of errors) console.error(e);
		console.error('\n' + errors.length + ' problem' + (errors.length > 1 ? 's' : ''));
		process.exit(1);
	}
	console.log('content OK');
}
