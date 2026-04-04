// Assignment Operators
type AssignVarBool = [string, '=' | '!', boolean];
type AssignVarNum = [string, '=' | '+' | '-' | '%' | '*', number];
type AssignVarStr = [string, '=' | '+=', string];
export type Assignments = AssignVarBool | AssignVarNum | AssignVarStr;

// Comperator Operators
type CMPVarBool = [string, '==' | '!=' | '!!' | '!', boolean];
type CMPVarNum = [string, '==' | '!=' | '>=' | '>' | '<' | '<=' | '!!', number];
type CMPVarStr = [string, '==' | '!=' | '>=' | '>' | '<' | '<=' | '!!', string];
type CMPVarENUM = [string, 'in', string[]];
export type Comperators = CMPVarBool | CMPVarNum | CMPVarStr | CMPVarENUM;

interface VarString {
	type: 'string';
	max?: number;
	min?: number;
	match?: RegExp;
	default?: string;
}
interface VarNumber {
	type: 'number';
	max?: number;
	min?: number;
	default?: number;
}
interface VarBoolean {
	type: 'boolean';
	default?: boolean;
}
interface VarEnum {
	type: 'enum';
	values?: string[];
	default?: string;
}

export type Variable = VarBoolean | VarNumber | VarEnum | VarString;

export interface Effects {
	enabled: Comperators[] | boolean;
	visible: Comperators[] | boolean;
}

export interface State {
	id: string;
	variables: Record<string, Variable>;
	effects: Effects;
}

export interface Target {
	to: string;
	enabled: Comperators[] | boolean;
}

export interface Option {
	state: State;
	onchange: Assignments[];
	selected: boolean;
	target: Target;
}

export interface Section {
	state: State;
	options: Option[];
}

export interface Screen {
	type: 'screen';
	state: State;
	sections: Section[];
	target: Target;
}

export interface Group {
	type: 'group';
	state: State;
	nodes: Node[];
}

export type Node = Group | Screen;

export interface Project {
	id: 'root';
	name: string;
	variables: Record<string, Variable>;
	nodes: Node[];
}
