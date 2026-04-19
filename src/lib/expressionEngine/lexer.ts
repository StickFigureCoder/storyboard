import type { Token } from './types';

export function tokenize(input: string): Token[] {
	let current = 0;
	const tokens: Token[] = [];

	while (current < input.length) {
		let char = input[current];

		// Skip whitespace
		if (/\s/.test(char)) {
			current++;
			continue;
		}

		// Parentheses
		if (char === '(') {
			tokens.push({ type: 'LPAREN', value: char });
			current++;
			continue;
		}
		if (char === ')') {
			tokens.push({ type: 'RPAREN', value: char });
			current++;
			continue;
		}

		// Multi-character Operators (==, !=, >=, <=, &&, ||)
		const nextChar = input[current + 1];
		if ((char === '=' || char === '!' || char === '>' || char === '<') && nextChar === '=') {
			tokens.push({ type: 'OPERATOR', value: char + nextChar });
			current += 2;
			continue;
		}
		if (char === '&' && nextChar === '&') {
			tokens.push({ type: 'OPERATOR', value: '&&' });
			current += 2;
			continue;
		}
		if (char === '|' && nextChar === '|') {
			tokens.push({ type: 'OPERATOR', value: '||' });
			current += 2;
			continue;
		}

		// Single-character Operators
		if (/[+\-*/<>=!]/.test(char)) {
			tokens.push({ type: 'OPERATOR', value: char });
			current++;
			continue;
		}

		// Numbers
		if (/[0-9]/.test(char)) {
			let value = '';
			while (/[0-9.]/.test(char) && current < input.length) {
				value += char;
				char = input[++current];
			}
			tokens.push({ type: 'NUMBER', value });
			continue;
		}

		// Strings (Single or Double Quotes)
		if (char === '"' || char === "'") {
			const quoteType = char;
			let value = '';
			char = input[++current]; // Skip opening quote
			while (char !== quoteType && current < input.length) {
				value += char;
				char = input[++current];
			}
			current++; // Skip closing quote
			tokens.push({ type: 'STRING', value });
			continue;
		}

		// Identifiers & Booleans (e.g., player.gold, true, false)
		if (/[a-zA-Z_.]/.test(char)) {
			let value = '';
			while (/[a-zA-Z0-9_.]/.test(char) && current < input.length) {
				value += char;
				char = input[++current];
			}
			if (value === 'true' || value === 'false') {
				tokens.push({ type: 'BOOLEAN', value });
			} else {
				tokens.push({ type: 'IDENTIFIER', value });
			}
			continue;
		}

		throw new Error(`Lexer Error: Unknown character: ${char}`);
	}

	tokens.push({ type: 'EOF', value: '' });
	return tokens;
}
