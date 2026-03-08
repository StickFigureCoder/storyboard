// Variables
interface VarString {
	type: 'string';
	max?: number;
	min?: number;
	match?: RegExp;
	default?: string;
	current: string;
}
interface VarNumber {
	type: 'number';
	max?: number;
	min?: number;
	default?: number;
	current: number;
}
interface VarBoolean {
	type: 'boolean';
	default?: boolean;
	current: boolean;
}
interface VarEnum {
	type: 'enum';
	values?: string[];
	default?: string;
	current: string;
}

export type Variable = VarBoolean | VarNumber | VarString | VarEnum;

type VarAt = 'root' | 'section';
export interface CreateVar {
	at: VarAt;
	section_index?: number;
	name: string;
	value?: Variable;
}
export interface RemoveVar {
	at: VarAt;
	section_index?: number;
	name: string;
}

// Relational Operators
type BooleanCompareToVar = [string, '==' | '!=' | '!!' | '!', boolean];
type NumberCompareToVar = [string, '==' | '!=' | '>=' | '>' | '<' | '<=' | '!!', number];
type StringCompareTovar = [string, '==' | '!=' | '>=' | '>' | '<' | '<=' | '!!', string];
export type RelationalOperator = BooleanCompareToVar | NumberCompareToVar | StringCompareTovar;

// Assignment Operators
type StringAssignToVar = [string, '=' | '+=', string];
type NumberAssignToVar = [string, '=' | '+' | '-' | '%' | '*', number];
type BooleanAssignToVar = [string, '=' | '!', boolean];
export type AssignmentOperators = BooleanAssignToVar | NumberAssignToVar | StringAssignToVar;

// Action
export interface Action {
	visible: RelationalOperator[];
	enabled: RelationalOperator[];
	target: string | null;
}

type ActionFor = 'visible' | 'enabled' | 'target';
type ActionAt = 'section' | 'option';
export interface CreateAction {
	at: ActionAt;
	section_index: number;
	option_index?: number;
	action: ActionFor;
	value?: RelationalOperator | string;
}
export interface RemoveAction {
	at: ActionAt;
	section_index: number;
	option_index?: number;
	action: ActionFor;
	action_index?: number;
}

// Option
export interface Option extends Action {
	id: string;
	name: string;
	set: AssignmentOperators[];
}

// Section
export interface Section extends Action {
	id: string;
	name: string;
	variables: Record<string, Variable>;
	options: Option[];
	subsections: Section[];
}

export interface Project {
	id: string;
	name: string;
	version: string;
	variables: Record<string, Variable>;
	sections: Section[];
}
