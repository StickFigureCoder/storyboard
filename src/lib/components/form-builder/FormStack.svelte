<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button/index.js';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import FormField from './FormField.svelte';
	import GroupField from './GroupField.svelte';
	import type { FieldConfig, FormFrame, FormStackContext } from './types';
	import { FORM_STACK_CONTEXT } from './types';

	let {
		fields,
		values,
		errors = {},
		children
	}: {
		fields: FieldConfig[];
		values: Record<string, unknown>;
		errors?: Record<string, string | null>;
		/** Rendered only on the root screen — pass the submit button here. */
		children?: Snippet;
	} = $props();

	// The navigation stack. Index 0 is always the root form.
	let stack = $state<FormFrame[]>([{ id: 'root', title: 'Form', fields, values }]);

	// Which way we're moving, so the slide transition goes the right direction.
	let direction = $state<'forward' | 'back'>('forward');

	let current = $derived(stack[stack.length - 1]);

	function push(frame: FormFrame) {
		direction = 'forward';
		stack.push(frame);
	}

	function pop() {
		if (stack.length > 1) {
			direction = 'back';
			stack.pop();
		}
	}

	// Any GroupField in the tree (including nested ones inside pushed frames)
	// can call push/pop via getContext(FORM_STACK_CONTEXT).
	setContext<FormStackContext>(FORM_STACK_CONTEXT, { push, pop });
</script>

<!--
  Outer wrapper is `display: grid` so the outgoing and incoming frame can
  both occupy the same grid cell ([grid-area:1/1]) while they slide past
  each other — this keeps the container sized to whichever frame is taller
  and avoids layout collapse from absolute positioning.
-->
<div class="relative grid overflow-x-hidden">
	{#key current.id}
		<div
			class="grid grid-cols-2 gap-4 [grid-area:1/1]"
			in:fly={{ x: direction === 'forward' ? 40 : -40, duration: 200 }}
			out:fly={{ x: direction === 'forward' ? -40 : 40, duration: 200 }}
		>
			{#if stack.length > 1}
				<div class="col-span-2">
					<Button type="button" variant="ghost" size="sm" onclick={pop} class="-ml-2">
						<ChevronLeft class="mr-1 h-4 w-4" />
						Back
					</Button>
					<h3 class="mt-1 text-lg font-medium">{current.title}</h3>
				</div>
			{/if}

			{#each current.fields as field, i (i)}
				{#if field.type === 'group'}
					<div class="col-span-2">
						<GroupField
							{field}
							bind:value={current.values[field.name] as Record<string, unknown>[]}
						/>
					</div>
				{:else}
					<FormField
						{field}
						bind:value={current.values[field.name]}
						error={stack.length === 1 ? (errors[field.name] ?? null) : null}
					/>
				{/if}
			{/each}

			<div class="col-span-2">
				{#if stack.length === 1}
					{@render children?.()}
				{:else}
					<Button type="button" variant="outline" onclick={pop}>Done</Button>
				{/if}
			</div>
		</div>
	{/key}
</div>
