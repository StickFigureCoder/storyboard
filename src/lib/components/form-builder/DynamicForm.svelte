<script lang="ts">
	import FormStack from './FormStack.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { FieldConfig } from './types';

	let {
		fields,
		onsubmit,
		submitLabel = 'Submit'
	}: {
		fields: FieldConfig[];
		onsubmit: (values: Record<string, unknown>) => void;
		submitLabel?: string;
	} = $props();

	function makeDefault(field: FieldConfig): unknown {
		if (field.type === 'group') return [];
		if (field.type === 'checkbox' || field.type === 'switch') return false;
		return '';
	}

	// FIX: this was `$derived(...)` in the previous pass, which is wrong here —
	// $derived recomputes from its dependencies and child bindings writing into
	// values[field.name] won't persist the way they need to. Use the $state +
	// IIFE pattern from the gotchas table instead (avoids the "stale reference
	// in $props context" warning while still giving a real mutable $state object).
	let values = $state<Record<string, unknown>>(
		(() => Object.fromEntries(fields.map((f) => [f.name, makeDefault(f)])))()
	);

	let errors = $state<Record<string, string | null>>({});

	// NOTE: still only validates top-level required fields, same as before.
	// Per-item validation for group fields is the next planned item — it'll
	// need to walk into values[f.name] (an array of item objects) for every
	// field of type 'group' and check each item's required sub-fields.
	function validate(): boolean {
		const next: Record<string, string | null> = {};
		for (const field of fields) {
			if (field.required && !values[field.name]) {
				next[field.name] = `${field.label} is required`;
			}
		}
		errors = next;
		return Object.values(errors).every((e) => !e);
	}

	function handleSubmit() {
		if (validate()) onsubmit(values);
	}
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		handleSubmit();
	}}
>
	<FormStack {fields} {values} {errors}>
		<Button type="submit">{submitLabel}</Button>
	</FormStack>
</form>
