import type { ASTNode, ContextMap, ExpressionValue } from './types';

export function evaluate(node: ASTNode, context: ContextMap): ExpressionValue {
	switch (node.type) {
		case 'Literal': {
			// Wrapped in brackets to satisfy 'no-case-declarations'
			return node.value;
		}

		case 'Identifier': {
			if (!(node.name in context)) {
				throw new Error(`Evaluator Error: Variable '${node.name}' not found in state.`);
			}
			return context[node.name];
		}

		case 'UnaryExpression': {
			const arg = evaluate(node.argument, context);

			// Strict check: only allow '!' on booleans
			if (node.operator === '!') {
				if (typeof arg !== 'boolean') {
					throw new Error(`Strict Type Error: '!' operator requires a boolean. Got ${typeof arg}.`);
				}
				return !arg;
			}

			throw new Error(`Unknown unary operator: ${node.operator}`);
		}

		case 'BinaryExpression': {
			const left = evaluate(node.left, context);
			const right = evaluate(node.right, context);

			// STRICT MATH CHECKS
			if (['>', '<', '>=', '<=', '+', '-', '*', '/'].includes(node.operator)) {
				if (typeof left !== 'number' || typeof right !== 'number') {
					throw new Error(
						`Strict Type Error: Cannot perform '${node.operator}' on non-numbers. Got ${typeof left} and ${typeof right}.`
					);
				}
			}

			switch (node.operator) {
				// We use (left as number) because TypeScript doesn't track the type narrowing
				// from the .includes() array check above perfectly.
				case '+':
					return (left as number) + (right as number);
				case '-':
					return (left as number) - (right as number);
				case '*':
					return (left as number) * (right as number);
				case '/':
					if (right === 0) throw new Error('Math Error: Division by zero.');
					return (left as number) / (right as number);

				case '>':
					return (left as number) > (right as number);
				case '<':
					return (left as number) < (right as number);
				case '>=':
					return (left as number) >= (right as number);
				case '<=':
					return (left as number) <= (right as number);

				// STRICT EQUALITY CHECKS
				case '==':
					if (typeof left !== typeof right) {
						throw new Error("Strict Type Error: '==' requires matching types.");
					}
					return left === right;
				case '!=':
					if (typeof left !== typeof right) {
						throw new Error("Strict Type Error: '!=' requires matching types.");
					}
					return left !== right;

				// STRICT LOGIC CHECKS
				case '&&':
					if (typeof left !== 'boolean' || typeof right !== 'boolean') {
						throw new Error("Strict Type Error: '&&' requires booleans.");
					}
					return left && right;
				case '||':
					if (typeof left !== 'boolean' || typeof right !== 'boolean') {
						throw new Error("Strict Type Error: '||' requires booleans.");
					}
					return left || right;

				default:
					throw new Error(`Unknown binary operator: ${node.operator}`);
			}
		}

		// Satisfies the consistent-return ESLint rule
		default: {
			// @ts-expect-error - If we successfully map all ASTNodes, this should be unreachable
			throw new Error(`Evaluator Error: Unhandled node type '${node.type}'`);
		}
	}
}
