// TruScript highlighter: the same classes and rules as create.truworlds.com, so code blocks look as on the site.
const KEYWORDS = new Set(['new', 'func', 'if', 'elif', 'else', 'for', 'in', 'local', 'return', 'nil', 'true', 'false', 'and', 'or', 'not', 'expr', 'while', 'pass']);
const DIRECTIVES = new Set(['extends']);
const GLOBALS = new Set(['this', 'world', 'game', 'print', 'warn', 'error', 'math', 'table', 'string', 'range', 'tonumber', 'tobool', 'tostring', 'spawn', 'wait', 'time', 'random', 'printf', 'swap']);

export const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const span = (cls, text) => '<span class="ts-' + cls + '">' + escapeHtml(text) + '</span>';
const isDigit = (ch) => ch !== undefined && ch >= '0' && ch <= '9';
const isIdChar = (ch) => /[A-Za-z0-9_]/.test(ch);
const isIdStart = (ch) => /[A-Za-z_]/.test(ch);

export function highlightTruScript(code) {
	let out = '';
	let i = 0;
	const n = code.length;
	while (i < n) {
		const ch = code[i];
		if (ch === '#' && code[i + 1] === '#' && code[i + 2] === '#') {
			const end = code.indexOf('###', i + 3);
			const slice = end === -1 ? code.slice(i) : code.slice(i, end + 3);
			out += span('comment', slice); i += slice.length; continue;
		}
		if (ch === '#') {
			const end = code.indexOf('\n', i);
			const slice = end === -1 ? code.slice(i) : code.slice(i, end);
			out += span('comment', slice); i += slice.length; continue;
		}
		if (ch === '"' || ch === "'") {
			let j = i + 1;
			while (j < n && code[j] !== ch) { if (code[j] === '\\') j++; j++; }
			out += span('string', code.slice(i, j + 1)); i = j + 1; continue;
		}
		if (isDigit(ch)) {
			let j = i;
			while (j < n && isDigit(code[j])) j++;
			if (code[j] === '.' && isDigit(code[j + 1])) { j++; while (j < n && isDigit(code[j])) j++; }
			if (code[j] === 'e' || code[j] === 'E') {
				let k = j + 1;
				if (code[k] === '+' || code[k] === '-') k++;
				if (isDigit(code[k])) { while (k < n && isDigit(code[k])) k++; j = k; }
			}
			out += span('number', code.slice(i, j)); i = j; continue;
		}
		if (ch === '.' && i + 1 < n && isIdStart(code[i + 1])) {
			let j = i + 1;
			while (j < n && isIdChar(code[j])) j++;
			out += escapeHtml('.') + span('table-member', code.slice(i + 1, j)); i = j; continue;
		}
		if (isIdStart(ch)) {
			let j = i;
			while (j < n && isIdChar(code[j])) j++;
			const word = code.slice(i, j);
			let k = j;
			while (k < n && (code[k] === ' ' || code[k] === '\t')) k++;
			const next = k < n ? code[k] : '';
			if (KEYWORDS.has(word)) out += span('keyword', word);
			else if (DIRECTIVES.has(word)) out += span('directive', word);
			else if (GLOBALS.has(word)) out += span('global', word);
			else if (next === '(') out += word[0] >= 'A' && word[0] <= 'Z' ? span('constructor', word) : span('function', word);
			else if (word[0] >= 'A' && word[0] <= 'Z') out += span('type-ref', word);
			else out += escapeHtml(word);
			i = j; continue;
		}
		out += escapeHtml(ch); i++;
	}
	return out;
}
