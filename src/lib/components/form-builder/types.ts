export type FieldType =
	| 'text'
	| 'email'
	| 'password'
	| 'number'
	| 'textarea'
	| 'select'
	| 'checkbox'
	| 'switch'
	| 'group';

export interface SelectOption {
	label: string;
	value: string;
}

export interface FieldConfig {
	name: string;
	label: string;
	type: FieldType;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	description?: string;
	cols?: 1 | 2;

	// for select
	options?: SelectOption[];

	// for group
	fields?: FieldConfig[];
	itemLabel?: string;
	addLabel?: string;
	minItems?: number;
	maxItems?: number;

	preview?: 'row' | 'card';
	previewFields?: {
		image?: string; // sub-field name holding an image URL (card mode)
		title?: string; // sub-field name holding the item's title
		description?: string; // sub-field name holding a short description (card mode)
	};
}

export type FieldError = string | ErrorTree[];
export type ErrorTree = Record<string, FieldError>;

export interface FormFrame {
	id: string;
	title: string;
	fields: FieldConfig[];
	values: Record<string, unknown>;
	errors: ErrorTree;
}

/**
 * Context shape provided by FormStack and consumed by GroupField (at any
 * nesting depth) to navigate forward/back without prop drilling.
 */
export interface FormStackContext {
	push: (frame: FormFrame) => void;
	pop: () => void;
	goToPath: (path: { fieldName: string; itemIndex: number }[]) => void;
}

export const FORM_STACK_REGISTER = 'dynamic-form-stack-register';
export const FORM_STACK_CONTEXT = 'dynamic-form-stack';

export type FormStackRegister = (api: Pick<FormStackContext, 'goToPath'>) => void;
