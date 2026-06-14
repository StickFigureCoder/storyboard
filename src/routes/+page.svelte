<script lang="ts">
	import DynamicForm from '$lib/components/form-builder/DynamicForm.svelte';
	import type { FieldConfig } from '$lib/components/form-builder/types';

	const fields: FieldConfig[] = [
		{ name: 'title', label: 'Title', type: 'text', required: true, cols: 2 },
		{ name: 'email', label: 'Email', type: 'email', required: true, cols: 1 },
		{
			name: 'role',
			label: 'Role',
			type: 'select',
			cols: 1,
			options: [
				{ label: 'Admin', value: 'admin' },
				{ label: 'User', value: 'user' }
			]
		},
		{ name: 'notes', label: 'Notes', type: 'textarea', cols: 2 },
		{
			name: 'members',
			label: 'Members',
			type: 'group',
			preview: 'card',
			previewFields: { description: 'name' },
			itemLabel: 'Member',
			minItems: 1,
			fields: [
				{ name: 'name', label: 'Name', type: 'text', cols: 1 },
				{ name: 'email', label: 'Email', type: 'email', cols: 1 }
			]
		}
	];

	function handleSubmit(values: Record<string, unknown>) {
		console.log(JSON.stringify(values, null, 2));
	}
</script>

<div class="mx-auto max-w-2xl p-8">
	<DynamicForm {fields} onsubmit={handleSubmit} />
</div>
