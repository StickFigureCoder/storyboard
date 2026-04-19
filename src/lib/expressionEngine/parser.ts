import type { Token, ASTNode } from './types';

export function parse(tokens: Token[]): ASTNode {
	let current = 0;

	function walk(): ASTNode {
		const token = tokens[current];

		// Unary Expressions (e.g., !player.isDead)
		if (token.type === 'OPERATOR' && token.value === '!') {
			current++;
			return { type: 'UnaryExpression', operator: '!', argument: walk() };
		}

		// Parentheses Grouping
		if (token.type === 'LPAREN') {
			current++;
			const node = parseExpression();
			current++; // Skip RPAREN
			return node;
		}

		// Literals and Identifiers
		if (token.type === 'NUMBER') {
			current++;
			return { type: 'Literal', value: parseFloat(token.value) };
		}
		if (token.type === 'STRING') {
			current++;
			return { type: 'Literal', value: token.value };
		}
		if (token.type === 'BOOLEAN') {
			current++;
			return { type: 'Literal', value: token.value === 'true' };
		}
		if (token.type === 'IDENTIFIER') {
			current++;
			return { type: 'Identifier', name: token.value };
		}

		throw new Error(`Parser Error: Unexpected token ${token.value}`);
	}

	// Handle Binary Expressions and Precedence (Simplified for brevity)
	function parseExpression(): ASTNode {
		let left = walk();

		while (
			tokens[current].type === 'OPERATOR' &&
			tokens[current].value !== '!' // Unary handled in walk
		) {
			const operator = tokens[current].value;
			current++;
			const right = walk();
			left = { type: 'BinaryExpression', operator, left, right };
		}

		return left;
	}

	return parseExpression();
}
