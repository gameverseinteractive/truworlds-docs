export const NAME = /^[a-z0-9-]+$/;

const text = (v) => (typeof v === 'string' ? v : '');

export function parseToc(value) {
  if (!Array.isArray(value)) {
    return { entries: [], errors: ['toc.yaml must be a list of pages and sections'] };
  }
  const errors = [];
  const seen = new Set();
  const entries = walk(value, '', 'top level', seen, errors);
  return { entries, errors };
}

function walk(list, parent, where, seen, errors) {
  const entries = [];
  list.forEach((raw, i) => {
    const n = i + 1;
    const isObject = raw !== null && typeof raw === 'object' && !Array.isArray(raw);
    const hasPath = isObject && typeof raw.path === 'string';
    const hasSection = isObject && typeof raw.section === 'string';
    if (!hasPath && !hasSection) {
      errors.push(`${where}, entry ${n}: needs "path:" for a page or "section:" for a section`);
      return;
    }
    if (hasPath && hasSection) {
      errors.push(`${where}, entry ${n}: has both "path:" and "section:"`);
      return;
    }
    const kind = hasSection ? 'section' : 'page';
    const entryPath = hasSection ? raw.section : raw.path;

    const name = parent ? entryPath.slice(parent.length + 1) : entryPath;
    const prefixOk = !parent || entryPath.startsWith(parent + '/');
    if (!prefixOk || !NAME.test(name)) {
      const prefix = parent ? `"${parent}/" and ` : '';
      errors.push(`${kind} "${entryPath}": must be ${prefix}a name of lowercase letters, digits and hyphens`);
      return;
    }

    if (!parent) {
      if (entryPath === 'assets') {
        errors.push('"assets": "assets" is taken by the image route of the site');
        return;
      }
      if (entryPath === 'index') {
        errors.push(`${kind} "index": the landing is index.md at the content root, not a toc page`);
        return;
      }
    }

    if (seen.has(entryPath)) {
      errors.push(`"${entryPath}" is listed more than once`);
      return;
    }
    seen.add(entryPath);

    if (kind === 'page') {
      entries.push({ kind, path: entryPath, title: text(raw.title), description: text(raw.description) });
      return;
    }

    const pages = raw.pages === undefined || raw.pages === null ? [] : raw.pages;
    if (!Array.isArray(pages)) {
      errors.push(`section "${entryPath}": "pages:" must be a list`);
      return;
    }
    const children = walk(pages, entryPath, `section "${entryPath}"`, seen, errors);
    const indexPath = `${entryPath}/index`;
    const indexAt = children.findIndex((c) => c.kind === 'page' && c.path === indexPath);
    if (indexAt < 0) {
      errors.push(`section "${entryPath}" has no ${indexPath} page, so the site leaves it out`);
      return;
    }
    const [index] = children.splice(indexAt, 1);
    entries.push({
      kind,
      path: entryPath,
      title: text(raw.title) || entryPath.slice(entryPath.lastIndexOf('/') + 1),
      index: { path: index.path, title: index.title, description: index.description },
      entries: children,
    });
  });
  return entries;
}

export function listPages(entries) {
  const pages = [];
  for (const entry of entries) {
    if (entry.kind === 'page') {
      pages.push({ path: entry.path, title: entry.title, description: entry.description });
    } else {
      pages.push({ ...entry.index }, ...listPages(entry.entries));
    }
  }
  return pages;
}

export function listSections(entries) {
  const sections = [];
  for (const entry of entries) {
    if (entry.kind === 'section') sections.push(entry, ...listSections(entry.entries));
  }
  return sections;
}
