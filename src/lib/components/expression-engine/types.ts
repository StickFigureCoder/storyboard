// ---------------------------------------------------------------------------
// Operators
// ---------------------------------------------------------------------------

type ArithmeticOp = '+' | '-' | '*' | '/';
type ComparisonOp = '==' | '!=' | '<' | '>' | '<=' | '>=';
type LogicalOp = '&&' | '||';
export type BinaryOp = ArithmeticOp | ComparisonOp | LogicalOp;
export type UnaryOp = '!' | '-';

// ---------------------------------------------------------------------------
// AST nodes
// ---------------------------------------------------------------------------

type Literal = { kind: 'literal'; value: number | boolean | string; pos: number };
type Variable = { kind: 'variable'; name: string; pos: number };
type Binary = { kind: 'binary'; op: BinaryOp; left: Expression; right: Expression; pos: number };
type Unary = { kind: 'unary'; op: UnaryOp; operand: Expression; pos: number };

export type Expression = Literal | Variable | Binary | Unary;

// ---------------------------------------------------------------------------
// Runtime state
// ---------------------------------------------------------------------------

export type Binding =
	| { type: 'val'; value: number | boolean | string }
	| { type: 'expr'; expr: Expression; src: string };

export type State = Record<string, Binding>;
