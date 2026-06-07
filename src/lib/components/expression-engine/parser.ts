import { tokenise, type TKind, type Token } from './tokeniser';
import type { Expression } from './types';

const MAX_DEPTH = 100;
const MAX_TOKENS = 1_000;

class Parser {
	private tokens: Token[];
	private pos = 0;
	private depth = 0;

	constructor(src: string) {
		this.tokens = tokenise(src);
		if (this.tokens.length > MAX_TOKENS) {
			throw new SyntaxError(
				`Expression is too long (${this.tokens.length} tokens; maximum is ${MAX_TOKENS})`
			);
		}
	}

	// ---- helpers --------------------------------------------------------

	/**
	 * Runs `fn` inside an enter/leave pair, guaranteeing leave() is called
	 * even when fn throws.
	 */
	private withDepth<T>(fn: () => T): T {
		if (++this.depth > MAX_DEPTH) {
			throw new SyntaxError(`Expression exceeds maximum nesting depth (${MAX_DEPTH})`);
		}
		try {
			return fn();
		} finally {
			this.depth--;
		}
	}

	private peek(): Token | undefined {
		return this.tokens[this.pos];
	}

	/** Consume and return the current token. Caller must ensure a token exists. */
	private eat(): Token {
		// Safe: every call site checks peek() before calling eat().
		return this.tokens[this.pos++]!;
	}

	private match(...kinds: TKind[]): Token | undefined {
		const t = this.peek();
		if (t && kinds.includes(t.kind)) {
			this.pos++;
			return t;
		}
		return undefined;
	}

	// ---- grammar --------------------------------------------------------

	parse(): Expression {
		const expr = this.parseOr();
		if (this.pos < this.tokens.length) {
			const t = this.tokens[this.pos];
			throw new SyntaxError(`Unexpected token '${t.raw}' at position ${t.pos}`);
		}
		return expr;
	}

	/** level 1 – logical OR */
	private parseOr(): Expression {
		return this.withDepth(() => {
			let left = this.parseAnd();
			let op: Token | undefined;
			while ((op = this.match('||'))) {
				const right = this.parseAnd();
				left = { kind: 'binary', op: '||', left, right, pos: op.pos };
			}
			return left;
		});
	}

	/** level 2 – logical AND */
	private parseAnd(): Expression {
		return this.withDepth(() => {
			let left = this.parseEquality();
			let op: Token | undefined;
			while ((op = this.match('&&'))) {
				const right = this.parseEquality();
				left = { kind: 'binary', op: '&&', left, right, pos: op.pos };
			}
			return left;
		});
	}

	/** level 3 – equality */
	private parseEquality(): Expression {
		return this.withDepth(() => {
			let left = this.parseRelational();
			let op: Token | undefined;
			while ((op = this.match('==', '!='))) {
				const right = this.parseRelational();
				left = { kind: 'binary', op: op.kind as '==' | '!=', left, right, pos: op.pos };
			}
			return left;
		});
	}

	/** level 4 – relational
	 *
	 * Chaining (e.g. `1 < 2 < 3`) is explicitly forbidden because the result
	 * of a comparison is a boolean, so a chained comparison is almost always
	 * a mistake.  Use `1 < x && x < 3` instead.
	 */
	private parseRelational(): Expression {
		return this.withDepth(() => {
			const left = this.parseAddSub();
			const op = this.match('<', '>', '<=', '>=');
			if (op) {
				const right = this.parseAddSub();
				// Guard against accidental chaining: `a < b < c`
				if (this.peek() && ['<', '>', '<=', '>='].includes(this.peek()!.kind)) {
					throw new SyntaxError(
						`Chained comparisons are not supported. Use '&&' to combine conditions (e.g. a < b && b < c)`
					);
				}
				return { kind: 'binary', op: op.kind as '<' | '>' | '<=' | '>=', left, right, pos: op.pos };
			}
			return left;
		});
	}

	/** level 5 – additive */
	private parseAddSub(): Expression {
		return this.withDepth(() => {
			let left = this.parseMulDiv();
			let op: Token | undefined;
			while ((op = this.match('+', '-'))) {
				const right = this.parseMulDiv();
				left = { kind: 'binary', op: op.kind as '+' | '-', left, right, pos: op.pos };
			}
			return left;
		});
	}

	/** level 6 – multiplicative */
	private parseMulDiv(): Expression {
		return this.withDepth(() => {
			let left = this.parseUnary();
			let op: Token | undefined;
			while ((op = this.match('*', '/'))) {
				const right = this.parseUnary();
				left = { kind: 'binary', op: op.kind as '*' | '/', left, right, pos: op.pos };
			}
			return left;
		});
	}

	/** level 7 – unary ! and unary - */
	private parseUnary(): Expression {
		return this.withDepth(() => {
			const op = this.match('!', '-');
			if (op) {
				const operand = this.parseUnary();
				return { kind: 'unary', op: op.kind as '!' | '-', operand, pos: op.pos };
			}
			return this.parsePrimary();
		});
	}

	/** level 8 – primary */
	private parsePrimary(): Expression {
		const t = this.peek();
		if (!t) throw new SyntaxError('Unexpected end of expression');

		// Parenthesised expression
		if (this.match('(')) {
			const inner = this.parseOr();
			if (!this.match(')')) throw new SyntaxError("Expected ')'");
			return inner;
		}

		this.eat();

		if (t.kind === 'number') return { kind: 'literal', value: Number(t.raw), pos: t.pos };
		if (t.kind === 'boolean') return { kind: 'literal', value: t.raw === 'true', pos: t.pos };
		if (t.kind === 'string')
			return { kind: 'literal', value: JSON.parse(t.raw) as string, pos: t.pos };
		if (t.kind === 'ident') return { kind: 'variable', name: t.raw, pos: t.pos };

		throw new SyntaxError(`Unexpected token '${t.raw}' at position ${t.pos}`);
	}
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const parse = (expr: string): Expression => new Parser(expr).parse();
