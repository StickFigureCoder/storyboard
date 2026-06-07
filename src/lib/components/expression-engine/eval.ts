// ---------------------------------------------------------------------------
// Evaluator
// ---------------------------------------------------------------------------

import type { Expression, BinaryOp, UnaryOp, State } from './types';

// ---------------------------------------------------------------------------
// Runtime error
//
// Extends the built-in Error with the source position of the offending node
// so callers can point the user at the exact location in the expression.
// ---------------------------------------------------------------------------

export class EvalError extends Error {
	constructor(message: string, public readonly pos: number) {
		super(`${message} (position ${pos})`);
		this.name = 'EvalError';
	}
}

type Value = number | boolean | string;

// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

const isNumber  = (v: Value): v is number  => typeof v === 'number';
const isBoolean = (v: Value): v is boolean => typeof v === 'boolean';
const isString  = (v: Value): v is string  => typeof v === 'string';

// These helpers return a narrowed tuple [L, R] so TypeScript knows the types
// of *both* operands after the call, unlike `asserts` which only narrows one.
function requireNumbers(left: Value, right: Value, op: BinaryOp, pos: number): [number, number] {
	if (!isNumber(left) || !isNumber(right)) {
		throw new EvalError(
			`Operator '${op}' requires numbers, got ${typeName(left)} and ${typeName(right)}`,
			pos
		);
	}
	return [left, right];
}

function requireBooleans(left: Value, right: Value, op: BinaryOp, pos: number): [boolean, boolean] {
	if (!isBoolean(left) || !isBoolean(right)) {
		throw new EvalError(
			`Operator '${op}' requires booleans, got ${typeName(left)} and ${typeName(right)}`,
			pos
		);
	}
	return [left, right];
}

function typeName(v: Value): string {
	return typeof v; // 'number' | 'boolean' | 'string'
}

// ---------------------------------------------------------------------------
// Binary operator evaluation
// ---------------------------------------------------------------------------

function evalBinary(op: BinaryOp, left: Value, right: Value, pos: number): Value {
	switch (op) {
		// Arithmetic — numbers only, except '+' which also handles string concat
		case '+': {
			if (isString(left) && isString(right)) return left + right;
			const [l, r] = requireNumbers(left, right, op, pos);
			return l + r;
		}
		case '-': { const [l, r] = requireNumbers(left, right, op, pos); return l - r; }
		case '*': { const [l, r] = requireNumbers(left, right, op, pos); return l * r; }
		case '/': {
			// Division by zero returns Infinity (JS default) — no guard needed.
			const [l, r] = requireNumbers(left, right, op, pos);
			return l / r;
		}

		// Comparison — numbers or strings (same type on both sides)
		case '<':
		case '>':
		case '<=':
		case '>=':
			if (isNumber(left) && isNumber(right)) {
				return op === '<'  ? left <  right
					 : op === '>'  ? left >  right
					 : op === '<=' ? left <= right
					 :               left >= right;
			}
			if (isString(left) && isString(right)) {
				return op === '<'  ? left <  right
					 : op === '>'  ? left >  right
					 : op === '<=' ? left <= right
					 :               left >= right;
			}
			throw new EvalError(
				`Operator '${op}' requires two numbers or two strings, got ${typeName(left)} and ${typeName(right)}`,
				pos
			);

		// Equality — any type, but both sides must match
		case '==':
		case '!=': {
			if (typeName(left) !== typeName(right)) {
				throw new EvalError(
					`Operator '${op}' requires matching types, got ${typeName(left)} and ${typeName(right)}`,
					pos
				);
			}
			return op === '==' ? left === right : left !== right;
		}

		// Logical — booleans only
		case '&&': { const [l, r] = requireBooleans(left, right, op, pos); return l && r; }
		case '||': { const [l, r] = requireBooleans(left, right, op, pos); return l || r; }
	}
}

// ---------------------------------------------------------------------------
// Unary operator evaluation
// ---------------------------------------------------------------------------

function evalUnary(op: UnaryOp, operand: Value, pos: number): Value {
	switch (op) {
		case '!':
			if (!isBoolean(operand)) {
				throw new EvalError(
					`Operator '!' requires a boolean, got ${typeName(operand)}`,
					pos
				);
			}
			return !operand;
		case '-':
			if (!isNumber(operand)) {
				throw new EvalError(
					`Unary '-' requires a number, got ${typeName(operand)}`,
					pos
				);
			}
			return -operand;
	}
}

// ---------------------------------------------------------------------------
// Main recursive evaluator
// ---------------------------------------------------------------------------

export function evaluate(expr: Expression, state: State): Value {
	switch (expr.kind) {
		case 'literal':
			return expr.value;

		case 'variable': {
			const binding = state[expr.name];
			if (binding === undefined) {
				throw new EvalError(`Undefined variable '${expr.name}'`, expr.pos);
			}
			// A binding can be a plain value or a sub-expression.
			// Sub-expressions are evaluated lazily on first reference; for
			// repeated evaluation, memoisation should be added by the caller.
			if (binding.type === 'val') return binding.value;
			return evaluate(binding.expr, state);
		}

		case 'unary':
			return evalUnary(expr.op, evaluate(expr.operand, state), expr.pos);

		case 'binary':
			return evalBinary(
				expr.op,
				evaluate(expr.left,  state),
				evaluate(expr.right, state),
				expr.pos
			);
	}
}