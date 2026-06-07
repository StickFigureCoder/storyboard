// Operators
type ArithmeticOp = '+' | '-' | '*' | '/';
type ComparisonOp = '==' | '!=' | '<' | '>' | '<=' | '>=';
type LogicalOp    = '&&' | '||';
type BinaryOp     = ArithmeticOp | ComparisonOp | LogicalOp;
type UnaryOp      = '!';

// AST nodes
type Literal  = { kind: 'literal';  value: number | boolean | string };
type Variable = { kind: 'variable'; name: string };
type Binary   = { kind: 'binary';   op: BinaryOp; left: Expression; right: Expression };
type Unary    = { kind: 'unary';    op: UnaryOp;  operand: Expression };

export type Expression = Literal | Variable | Binary | Unary;

export type Binding =
    | { type: 'val';  value: number | boolean | string }
    | { type: 'expr'; expr: Expression; src: string };

export type State = Record<string, Binding>;