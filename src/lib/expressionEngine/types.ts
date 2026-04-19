// --- TOKENS ---
export type TokenType =
	| 'NUMBER'
	| 'STRING'
	| 'BOOLEAN'
	| 'IDENTIFIER'
	| 'OPERATOR'
	| 'LPAREN'
	| 'RPAREN'
	| 'EOF';

export interface Token {
	type: TokenType;
	value: string;
}

// --- AST NODES ---
export type ASTNode = LiteralNode | IdentifierNode | BinaryExpressionNode | UnaryExpressionNode;

export interface LiteralNode {
	type: 'Literal';
	value: number | string | boolean;
}

export interface IdentifierNode {
	type: 'Identifier';
	name: string; // e.g., "player.gold"
}

export interface BinaryExpressionNode {
	type: 'BinaryExpression';
	operator: string; // e.g., "==", ">=", "&&"
	left: ASTNode;
	right: ASTNode;
}

export interface UnaryExpressionNode {
	type: 'UnaryExpression';
	operator: string; // e.g., "!"
	argument: ASTNode;
}

export type ExpressionValue = string | number | boolean;
export type ContextMap = Record<string, ExpressionValue>;
