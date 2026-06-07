type TLiteralKind = 'number' | 'boolean' | 'string' | 'ident';
// prettier-ignore
type TOpKind =
	| '+'  | '-'  | '*'  | '/'
	| '==' | '!='
	| '<=' | '>=' | '<' | '>'
	| '&&' | '||'
	| '!'
	| '('  | ')';

export type TKind = TLiteralKind | TOpKind;

export interface Token {
	kind: TKind;
	raw: string;
	pos: number;
}

export function tokenise(src: string): Token[] {
	// Regex is defined inside tokenise() to avoid shared mutable lastIndex
	// state, which would be unsafe under concurrent calls (e.g. in a Worker).
	const TOKEN_RE =
		/\s*(?:(true|false)|("(?:[^"\\]|\\.)*")|([0-9]+(?:\.[0-9]+)?)|([A-Za-z_]\w*)|(==|!=|<=|>=|&&|\|\||[+\-*/<>!()]))\s*/y;

	const tokens: Token[] = [];

	while (TOKEN_RE.lastIndex < src.length) {
		const pos = TOKEN_RE.lastIndex;
		const m = TOKEN_RE.exec(src);
		if (!m) throw new SyntaxError(`Unexpected character at position ${pos}: '${src[pos]}'`);

		const [, bool, str, num, ident, sym] = m;

		if (bool !== undefined) tokens.push({ kind: 'boolean', raw: bool, pos });
		else if (str !== undefined) tokens.push({ kind: 'string', raw: str, pos });
		else if (num !== undefined) tokens.push({ kind: 'number', raw: num, pos });
		else if (ident !== undefined) tokens.push({ kind: 'ident', raw: ident, pos });
		else tokens.push({ kind: sym as TOpKind, raw: sym, pos });
	}

	return tokens;
}
