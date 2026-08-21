#!/usr/bin/env node
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'content');
const GUIDES = join(CONTENT, 'guides');
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const IMAGE_MAX = 1024 * 1024;
const NAV_FILE = 'nav.yml';

const errors = [];
const err = (file, msg) => errors.push(`${relative(ROOT, file).replaceAll('\\', '/')}: ${msg}`);
const underGuides = (file) => relative(CONTENT, file).replaceAll('\\', '/').startsWith('guides/');

function walk(dir, out = []) {
	for (const e of readdirSync(dir)) {
		const full = join(dir, e);
		if (statSync(full).isDirectory()) walk(full, out);
		else out.push(full);
	}
	return out;
}

function stripCode(text) {
	return text
		.replace(/^----$[\s\S]*?^----$/gm, '')
		.replace(/^\.\.\.\.$[\s\S]*?^\.\.\.\.$/gm, '')
		.replace(/`[^`\n]*`/g, '');
}

const FORBIDDEN = [
	[/pass:/i, 'pass: passthrough macro not allowed'],
	[/\+\+\+/, 'passthrough (+++ or ++++) not allowed'],
	[/include::/i, 'include:: not allowed'],
	[/xref:/i, 'xref: not supported - use site-absolute link: paths'],
	[/javascript:/i, 'javascript: URLs not allowed'],
	[/^\[[^\]\n]*subs\s*=/im, 'subs= block attribute not allowed'],
	[/link:(?!https?:|mailto:|\/)[^\s[]*:/i, 'link: scheme not allowed - use https, mailto, or site-absolute paths']
];

function checkAdoc(file) {
	const raw = readFileSync(file, 'utf-8');
	const isGuide = relative(CONTENT, file).replaceAll('\\', '/').startsWith('guides/');
	const firstLine = raw.split('\n').find((l) => l.trim() !== '') ?? '';
	if (isGuide && !/^= \S/.test(firstLine)) err(file, 'guides must start with a "= Title" line');

	const text = stripCode(raw);
	if (/^:nav-order:/m.test(text)) err(file, 'nav-order is dead - order pages with nav.yml instead');
	for (const [re, msg] of FORBIDDEN) {
		const m = text.match(re);
		if (m) err(file, `${msg} (found: ${m[0]})`);
	}

	for (const m of text.matchAll(/image::?([^\s[\]]+)\[/g)) {
		const target = m[1];
		if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('//')) {
			err(file, `external image not allowed: ${target}`);
			continue;
		}
		if (target.includes('..')) { err(file, `image target must not traverse: ${target}`); continue; }
		const dest = join(dirname(file), target);
		if (!existsSync(dest)) err(file, `missing image: ${target}`);
		else if (!IMAGE_EXT.has(dest.slice(dest.lastIndexOf('.')).toLowerCase()))
			err(file, `image must be png/jpg/webp: ${target}`);
	}
}

function checkBinary(file) {
	const ext = file.slice(file.lastIndexOf('.')).toLowerCase();
	if (!IMAGE_EXT.has(ext)) { err(file, 'file type not allowed in content/'); return; }
	if (statSync(file).size > IMAGE_MAX) err(file, `image over ${IMAGE_MAX / 1024} KB`);
}

function checkStructure(dir) {
	for (const e of readdirSync(dir)) {
		const full = join(dir, e);
		if (!statSync(full).isDirectory()) continue;
		if (!existsSync(join(full, 'index.adoc')) && !existsSync(join(dir, e + '.adoc')))
			err(full, 'orphan folder: needs index.adoc or a sibling <name>.adoc');
		checkStructure(full);
	}
}

function parseNav(file) {
	const lines = readFileSync(file, 'utf-8').split('\n');
	const entries = [];
	lines.forEach((line, i) => {
		const l = line.replace(/\r$/, '');
		const trimmed = l.trim();
		if (trimmed === '' || trimmed.startsWith('#')) return;
		const m = /^- (?!\.+$)([A-Za-z0-9._-]+)$/.exec(l);
		if (!m) { err(file, `malformed line ${i + 1}: "${l}" (expected "- slug")`); return; }
		entries.push(m[1]);
	});
	return entries;
}

function navNodeExists(dir, name) {
	if (existsSync(join(dir, name + '.adoc'))) return true;
	const sub = join(dir, name);
	return existsSync(sub) && statSync(sub).isDirectory() && existsSync(join(sub, 'index.adoc'));
}

function checkNav(dir) {
	const entries = readdirSync(dir);
	const children = new Set();
	for (const e of entries) {
		const full = join(dir, e);
		if (statSync(full).isDirectory()) children.add(e);
		else if (e.endsWith('.adoc') && e !== 'index.adoc') children.add(e.slice(0, -'.adoc'.length));
	}

	const navFile = join(dir, NAV_FILE);
	if (existsSync(navFile)) {
		const listed = new Set();
		for (const entry of parseNav(navFile)) {
			if (entry === 'index') { err(navFile, 'index must not be listed'); continue; }
			if (listed.has(entry)) { err(navFile, `duplicate entry: ${entry}`); continue; }
			listed.add(entry);
			if (!navNodeExists(dir, entry))
				err(navFile, `entry does not exist: ${entry} (expected ${entry}.adoc or ${entry}/index.adoc)`);
		}
		for (const child of children) {
			if (!listed.has(child))
				console.error(`${relative(ROOT, dir).replaceAll('\\', '/')}: ${child} not listed in nav.yml`);
		}
	}

	for (const e of entries) {
		const full = join(dir, e);
		if (statSync(full).isDirectory()) checkNav(full);
	}
}

for (const f of walk(CONTENT)) {
	if (basename(f) === NAV_FILE) {
		if (!underGuides(f)) err(f, 'nav.yml only allowed under content/guides/');
		continue;
	}
	(f.endsWith('.adoc') ? checkAdoc : checkBinary)(f);
}
checkStructure(GUIDES);
checkNav(GUIDES);

if (errors.length) {
	console.error(errors.join('\n'));
	console.error(`\n${errors.length} problem(s).`);
	process.exit(1);
}
console.log('content OK');
