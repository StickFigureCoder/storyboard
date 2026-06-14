import type { ErrorTree, FieldConfig, FieldError } from './types';

/**
 * Recursively validates `values` against `fields`.
 *
 * Returns an ErrorTree with the same shape as `values`:
 * - a leaf field with a problem gets a string message
 * - a group field gets an array with one ErrorTree per item (always present,
 *   even if empty `{}`, so callers can index by item position)
 *
 * Fields with no error are simply absent from the returned tree — check
 * `hasErrors()` / `fieldHasError()` rather than relying on key presence.
 */
export function validateFields(fields: FieldConfig[], values: Record<string, unknown>): ErrorTree {
	const errors: ErrorTree = {};

	for (const field of fields) {
		if (field.type === 'group') {
			const items = (values[field.name] as Record<string, unknown>[] | undefined) ?? [];
			const subFields = field.fields ?? [];
			const itemErrors = items.map((item) => validateFields(subFields, item));

			// Top-level minItems check (e.g. "at least 1 required") surfaces as a
			// string error on the group field itself, alongside the per-item array.
			if (field.required && items.length === 0) {
				errors[field.name] = `${field.label} requires at least one item`;
			}

			if (itemErrors.some((e) => Object.keys(e).length > 0)) {
				errors[field.name] = itemErrors;
			} else if (!(field.name in errors)) {
				// Still record an empty array so downstream code can index by
				// item position without special-casing "no errors at all".
				errors[field.name] = itemErrors;
			}
		} else if (field.required && !values[field.name]) {
			errors[field.name] = `${field.label} is required`;
		}
	}

	return errors;
}

/** True if the ErrorTree (or any nested item) contains at least one message. */
export function hasErrors(errors: ErrorTree): boolean {
	return Object.values(errors).some((e) => fieldErrorHasMessage(e));
}

function fieldErrorHasMessage(e: FieldError | undefined): boolean {
	if (!e) return false;
	if (typeof e === 'string') return true;
	// array of per-item ErrorTrees — recurse
	return e.some((itemErrors) => hasErrors(itemErrors));
}

/** True if this specific field's entry in the tree has a message (leaf only). */
export function fieldHasError(errors: ErrorTree, fieldName: string): boolean {
	const e = errors[fieldName];
	return typeof e === 'string' && e.length > 0;
}

/** True if any item within a group field's error array has any error. */
export function itemHasError(errors: ErrorTree, fieldName: string, index: number): boolean {
	const e = errors[fieldName];
	if (!Array.isArray(e)) return false;
	const itemErrors = e[index];
	return itemErrors ? hasErrors(itemErrors) : false;
}

/**
 * A path describing how to reach the first invalid group item, so the UI
 * can auto-navigate the wizard stack to it. Each step is
 * { fieldName, itemIndex } — e.g. [{ fieldName: 'options', itemIndex: 2 }]
 * means "open item 2 of the 'options' group". Multiple steps describe
 * nested groups (group inside group).
 */
export interface ErrorPathStep {
	fieldName: string;
	itemIndex: number;
}

export function findFirstErrorPath(
	fields: FieldConfig[],
	errors: ErrorTree
): ErrorPathStep[] | null {
	// First pass: any leaf errors at this level? If so, stay here.
	const hasLeafError = fields.some((f) => f.type !== 'group' && fieldHasError(errors, f.name));
	if (hasLeafError) return null;

	// Second pass: find the first group with an invalid item, recurse into it.
	for (const field of fields) {
		if (field.type !== 'group') continue;
		const e = errors[field.name];
		if (!Array.isArray(e)) continue;

		for (let i = 0; i < e.length; i++) {
			if (hasErrors(e[i])) {
				const nested = findFirstErrorPath(field.fields ?? [], e[i]);
				return [{ fieldName: field.name, itemIndex: i }, ...(nested ?? [])];
			}
		}
	}

	return null;
}
