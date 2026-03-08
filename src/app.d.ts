// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

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

		type Variable = VarBoolean | VarNumber | VarString | VarEnum;

		// Relational Operators
		type BooleanCompareToVar = [string, '==' | '!=' | '!!' | '!', boolean];
		type NumberCompareToVar = [string, '==' | '!=' | '>=' | '>' | '<' | '<=' | '!!', number];
		type StringCompareTovar = [string, '==' | '!=' | '>=' | '>' | '<' | '<=' | '!!', string];
		type RelationalOperator = BooleanCompareToVar | NumberCompareToVar | StringCompareTovar;

		// Assignment Operators
		type StringAssignToVar = [string, '=' | '+=', string];
		type NumberAssignToVar = [string, '=' | '+' | '-' | '%' | '*', number];
		type BooleanAssignToVar = [string, '=' | '!', boolean];
		type AssignmentOperators = BooleanAssignToVar | NumberAssignToVar | StringAssignToVar;

		interface Action {
			visible: RelationalOperator[];
			enabled: RelationalOperator[];
			target: string | null;
		}

		// Option
		interface Option extends Action {
			id: string;
			name: string;
			set: AssignmentOperators[];
		}

		// Section
		interface Section extends Action {
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
	}
}

export {};
