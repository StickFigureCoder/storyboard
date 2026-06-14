<script lang="ts">
	import { setContext } from 'svelte';
	import FormStack from './FormStack.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { ErrorTree, FieldConfig, FormStackContext } from './types';
	import { FORM_STACK_REGISTER } from './types';
	import { validateFields, hasErrors, findFirstErrorPath } from './validation';

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

	// $state + IIFE pattern — see Svelte 5 gotchas. Required so child bindings
	// (including deep group-item mutations) durably write back into this object.
	let values = $state<Record<string, unknown>>(
		(() => Object.fromEntries(fields.map((f) => [f.name, makeDefault(f)])))()
	);

	let errors = $state<ErrorTree>({});

	// FormStack is a child/descendant, so it can't be reached via getContext
	// from here (context flows down, not up). Instead, provide a registration
	// callback that FormStack calls during its own init to hand back its
	// navigation API.
	let stackApi: Pick<FormStackContext, 'goToPath'> | undefined;
	setContext(FORM_STACK_REGISTER, (api: Pick<FormStackContext, 'goToPath'>) => {
		stackApi = api;
	});

	function handleSubmit() {
		const tree = validateFields(fields, values);
		errors = tree;

		if (hasErrors(tree)) {
			// Root-level required-field errors show inline automatically (errors
			// is reactive and read by FormStack/FormField). If the only problems
			// are inside a group item that isn't currently open, navigate there.
			const path = findFirstErrorPath(fields, tree);
			if (path) stackApi?.goToPath(path);
			return;
		}

		onsubmit(values);
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
