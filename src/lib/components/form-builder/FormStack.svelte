<script lang="ts">
	import { setContext, getContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button/index.js';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import FormField from './FormField.svelte';
	import GroupField from './GroupField.svelte';
	import type {
		ErrorTree,
		FieldConfig,
		FormFrame,
		FormStackContext,
		FormStackRegister
	} from './types';
	import { FORM_STACK_CONTEXT, FORM_STACK_REGISTER } from './types';
	import { fieldHasError } from './validation';

	let {
		fields,
		values,
		errors = {},
		children
	}: {
		fields: FieldConfig[];
		values: Record<string, unknown>;
		errors?: ErrorTree;
		children?: Snippet;
	} = $props();

	// IIFE wrapper avoids the "state_referenced_locally" warning — `fields`
	// and `values` are captured once at init (they're stable references for
	// the lifetime of the form), while `errors` is kept in sync separately
	// below since it's reassigned wholesale on each submit attempt.
	let stack = $state<FormFrame[]>(
		(() => [{ id: 'root', title: 'Form', fields, values, errors }])()
	);

	// Keep the root frame's errors in sync when DynamicForm re-validates.
	$effect(() => {
		stack[0].errors = errors;
	});

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

	function reset() {
		direction = 'back';
		stack = [stack[0]];
	}

	/**
	 * Navigate to a specific nested group item by following a path of
	 * { fieldName, itemIndex } steps from the root frame. Used to jump
	 * straight to the first item with a validation error after a failed submit.
	 *
	 * Exposed via context (not bind:api) so DynamicForm can call it without
	 * FormStack needing a bindable prop just to hand back one function.
	 */
	function goToPath(path: { fieldName: string; itemIndex: number }[]) {
		reset();
		let frame = stack[0];

		for (const step of path) {
			const items = (frame.values[step.fieldName] as Record<string, unknown>[] | undefined) ?? [];
			const item = items[step.itemIndex];
			if (!item) break;

			const subFields = frame.fields.find((f) => f.name === step.fieldName)?.fields ?? [];
			const itemErrorsArray = frame.errors[step.fieldName];
			const itemErrors = Array.isArray(itemErrorsArray)
				? (itemErrorsArray[step.itemIndex] ?? {})
				: {};

			const next: FormFrame = {
				id: `${step.fieldName}-${step.itemIndex}-${crypto.randomUUID()}`,
				title: `${step.fieldName} ${step.itemIndex + 1}`,
				fields: subFields,
				values: item,
				errors: itemErrors
			};
			direction = 'forward';
			stack.push(next);
			frame = next;
		}
	}

	// Any GroupField in the tree (including nested ones inside pushed frames)
	// can call push/pop via getContext(FORM_STACK_CONTEXT).
	setContext<FormStackContext>(FORM_STACK_CONTEXT, { push, pop, goToPath });

	// Hand goToPath up to DynamicForm (an ancestor) via a registration
	// callback — context flows down, so DynamicForm can't getContext()
	// something set here; instead it set FORM_STACK_REGISTER for us to call.
	const register = getContext<FormStackRegister | undefined>(FORM_STACK_REGISTER);
	register?.({ goToPath });
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
							errors={current.errors[field.name]}
						/>
						{#if fieldHasError(current.errors, field.name)}
							<p class="mt-1 text-xs text-destructive">{current.errors[field.name]}</p>
						{/if}
					</div>
				{:else}
					<FormField
						{field}
						bind:value={current.values[field.name]}
						error={fieldHasError(current.errors, field.name)
							? (current.errors[field.name] as string)
							: null}
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
