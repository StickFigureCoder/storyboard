<script lang="ts">
	import { getContext } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio/index.js';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Plus from '@lucide/svelte/icons/plus';
	import ImageIcon from '@lucide/svelte/icons/image';
	import type { FieldConfig, FieldError, FormFrame, FormStackContext } from './types';
	import { FORM_STACK_CONTEXT } from './types';
	import { hasErrors } from './validation';

	let {
		field,
		value = $bindable([]),
		errors
	}: {
		field: FieldConfig;
		value?: Record<string, unknown>[];
		/** This group field's entry from the parent ErrorTree — an array of per-item ErrorTrees. */
		errors?: FieldError;
	} = $props();

	const stack = getContext<FormStackContext>(FORM_STACK_CONTEXT);

	const subFields = $derived(field.fields ?? []);
	const min = $derived(field.minItems ?? 0);
	const max = $derived(field.maxItems ?? Infinity);
	const previewMode = $derived(field.preview ?? 'row');

	// `value` is a reference into the parent's $state tree, so .push()/.splice()
	// on it are reactive directly — no local mirror + sync-effect needed.
	let items = $derived(value ?? []);

	// `errors` is an array of per-item ErrorTrees (set by validateFields).
	// Absent/undefined just means "not validated yet" — treat as no errors.
	const itemErrorTrees = $derived(Array.isArray(errors) ? errors : []);

	function itemHasErrorAt(index: number): boolean {
		const e = itemErrorTrees[index];
		return e ? hasErrors(e) : false;
	}

	function makeEmpty(): Record<string, unknown> {
		return Object.fromEntries(
			subFields.map((f) => {
				if (f.type === 'group') return [f.name, []];
				if (f.type === 'checkbox' || f.type === 'switch') return [f.name, false];
				return [f.name, ''];
			})
		);
	}

	// Seed minimum items.
	$effect(() => {
		while (value.length < min) {
			value.push(makeEmpty());
		}
	});

	// Resolve which sub-field supplies each preview piece. `previewFields`
	// takes priority; falling back to the old heuristic (a sub-field literally
	// named 'title' or 'name') keeps existing schemas working unchanged.
	const titleKey = $derived(
		field.previewFields?.title ??
			subFields.find((f) => f.name === 'title' || f.name === 'name')?.name
	);
	const descriptionKey = $derived(field.previewFields?.description);
	const imageKey = $derived(field.previewFields?.image);

	function itemLabel(item: Record<string, unknown>, index: number): string {
		const text = titleKey ? (item?.[titleKey] as string | undefined) : undefined;
		return text?.trim() ? text : `${field.itemLabel ?? 'Item'} ${index + 1}`;
	}

	function itemDescription(item: Record<string, unknown>): string | undefined {
		const text = descriptionKey ? (item?.[descriptionKey] as string | undefined) : undefined;
		return text?.trim() ? text : undefined;
	}

	function itemImage(item: Record<string, unknown>): string | undefined {
		const src = imageKey ? (item?.[imageKey] as string | undefined) : undefined;
		return src?.trim() ? src : undefined;
	}

	function openItem(index: number) {
		const frame: FormFrame = {
			id: `${field.name}-${index}-${crypto.randomUUID()}`,
			title: itemLabel(items[index], index),
			fields: subFields,
			values: items[index],
			errors: itemErrorTrees[index] ?? {}
		};
		stack.push(frame);
	}

	function addItem() {
		if (value.length >= max) return;
		value.push(makeEmpty());
		openItem(value.length - 1);
	}

	function removeItem(index: number) {
		if (value.length <= min) return;
		value.splice(index, 1);
	}
</script>

<div class="space-y-2">
	<div class="flex items-center justify-between">
		<span class="text-sm font-medium">{field.label}</span>
		{#if field.description}
			<span class="text-xs text-muted-foreground">{field.description}</span>
		{/if}
	</div>

	{#if previewMode === 'card'}
		<!-- CARD MODE: grid of visual cards, last cell is an "Add" tile -->
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
			{#each items as item, i (i)}
				<Card.Root class="overflow-hidden p-0 {itemHasErrorAt(i) ? 'border-destructive' : ''}">
					<button type="button" class="block w-full text-left" onclick={() => openItem(i)}>
						<AspectRatio ratio={16 / 9} class="bg-muted">
							{#if itemImage(item)}
								<img
									src={itemImage(item)}
									alt={itemLabel(item, i)}
									class="h-full w-full object-cover"
								/>
							{:else}
								<div class="flex h-full w-full items-center justify-center">
									<ImageIcon class="h-6 w-6 text-muted-foreground" />
								</div>
							{/if}
						</AspectRatio>
						<Card.Header class="p-3">
							<Card.Title class="flex items-center gap-1.5 text-sm">
								{#if itemHasErrorAt(i)}
									<span class="h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" aria-hidden="true"
									></span>
								{/if}
								{itemLabel(item, i)}
							</Card.Title>
							{#if itemDescription(item)}
								<Card.Description class="line-clamp-2 text-xs">
									{itemDescription(item)}
								</Card.Description>
							{/if}
						</Card.Header>
					</button>
					<Card.Footer class="flex justify-end gap-1 p-2 pt-0">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							aria-label={`Edit ${itemLabel(item, i)}`}
							onclick={() => openItem(i)}
						>
							<Pencil class="h-4 w-4" />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							aria-label={`Remove ${itemLabel(item, i)}`}
							disabled={items.length <= min}
							onclick={() => removeItem(i)}
						>
							<Trash2 class="h-4 w-4" />
						</Button>
					</Card.Footer>
				</Card.Root>
			{/each}

			{#if items.length < max}
				<button
					type="button"
					onclick={addItem}
					class="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-sm text-muted-foreground hover:border-foreground hover:text-foreground"
				>
					<Plus class="h-5 w-5" />
					{field.addLabel ?? `Add ${field.itemLabel ?? 'Item'}`}
				</button>
			{/if}
		</div>
	{:else}
		<!-- ROW MODE: compact list -->
		{#if items.length === 0}
			<div class="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
				No {(field.itemLabel ?? 'item').toLowerCase()}s yet.
			</div>
		{:else}
			<ul class="divide-y rounded-md border">
				{#each items as item, i (i)}
					<li class="flex items-center justify-between gap-2 px-3 py-2">
						<button
							type="button"
							class="flex flex-1 items-center gap-1.5 truncate text-left text-sm hover:underline"
							onclick={() => openItem(i)}
						>
							{#if itemHasErrorAt(i)}
								<span class="h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" aria-hidden="true"
								></span>
							{/if}
							<span class="truncate">{itemLabel(item, i)}</span>
						</button>
						<div class="flex items-center gap-1">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								aria-label={`Edit ${itemLabel(item, i)}`}
								onclick={() => openItem(i)}
							>
								<Pencil class="h-4 w-4" />
							</Button>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								aria-label={`Remove ${itemLabel(item, i)}`}
								disabled={items.length <= min}
								onclick={() => removeItem(i)}
							>
								<Trash2 class="h-4 w-4" />
							</Button>
						</div>
					</li>
				{/each}
			</ul>
		{/if}

		<Button
			type="button"
			variant="outline"
			size="sm"
			disabled={items.length >= max}
			onclick={addItem}
		>
			<Plus class="mr-1 h-4 w-4" />
			{field.addLabel ?? `Add ${field.itemLabel ?? 'Item'}`}
		</Button>
	{/if}
</div>
