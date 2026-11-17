// Sidebar rows, card items and crumb trails for a parsed toc tree (see toc-tree.mjs). Pure, no imports.

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function navHtml(entries, activePath, guides) {
	return entries.map((e) => row(e, activePath, guides, 0)).join('');
}

function row(entry, activePath, guides, depth) {
	const pad = ' style="padding-left:' + 10 * depth + 'px"';
	const href = guides + '/' + esc(entry.path);
	const active = activePath === entry.path ? ' class="active"' : '';
	const hasChildren = entry.kind === 'section' && entry.entries.length > 0;
	if (!hasChildren) {
		return '<div class="row"' + pad + '><span class="spacer"></span><a href="' + href + '"' + active +
			' title="' + esc(entry.title) + '">' + esc(entry.title) + '</a></div>';
	}
	const open = activePath === entry.path || activePath.startsWith(entry.path + '/');
	return '<details class="group"' + (open ? ' open' : '') + '><summary class="row"' + pad + '><span class="caret">&#9654;</span>' +
		'<a href="' + href + '"' + active + '>' + esc(entry.title) + '</a></summary>' +
		entry.entries.map((e) => row(e, activePath, guides, depth + 1)).join('') + '</details>';
}

export function cardItems(entries) {
	return entries.map((e) => {
		if (e.kind === 'page') return { href: e.path, title: e.title, description: e.description, thumbPath: e.path };
		const n = e.entries.length;
		return {
			href: e.path,
			title: e.title,
			description: e.index.description || n + (n === 1 ? ' page' : ' pages'),
			thumbPath: e.path + '/index'
		};
	});
}

// Previous and next for reading a top-level section in order: its own page, then every entry depth-first
// in toc order (a nested section's page, then its entries, then on with the parent's next entry).
// Never crosses into another top-level section, and top-level pages (such as the Glossary) get none.
// Returns { prev, next }, each { path, title } or null.
export function pagerLinks(path, entries) {
	const top = entries.find((e) => e.kind === 'section' && (e.path === path || path.startsWith(e.path + '/')));
	if (!top) return { prev: null, next: null };
	const order = [];
	const visit = (e) => {
		order.push({ path: e.path, title: e.title });
		if (e.kind === 'section') e.entries.forEach(visit);
	};
	visit(top);
	const at = order.findIndex((s) => s.path === path);
	if (at < 0) return { prev: null, next: null };
	return { prev: order[at - 1] ?? null, next: order[at + 1] ?? null };
}

export function crumbTrail(path, entries) {
	const trail = [];
	let level = entries;
	for (;;) {
		const next = level.find((e) => e.kind === 'section' && path.startsWith(e.path + '/') && path !== e.index.path);
		if (!next) return trail;
		trail.push({ path: next.path, title: next.title });
		level = next.entries;
	}
}
