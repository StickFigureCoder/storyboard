<script lang="ts">
	import type { FieldConfig } from './types';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';

	let {
		field,
		value = $bindable(''),
		error = null
	}: {
		field: FieldConfig;
		value?: unknown;
		error?: string | null;
	} = $props();
</script>

<div class={field.cols === 1 ? 'col-span-1' : 'col-span-2'}>
	{#if field.type === 'checkbox' || field.type === 'switch'}
		<div class="flex items-center gap-2">
			{#if field.type === 'checkbox'}
				<Checkbox id={field.name} checked={value as boolean} onCheckedChange={(v) => (value = v)} />
			{:else}
				<Switch id={field.name} checked={value as boolean} onCheckedChange={(v) => (value = v)} />
			{/if}
			<Label for={field.name}>{field.label}</Label>
		</div>
	{:else}
		<Label for={field.name}>{field.label}{field.required ? ' *' : ''}</Label>

		{#if field.type === 'textarea'}
			<Textarea
				id={field.name}
				value={value as string}
				oninput={(e) => (value = e.currentTarget.value)}
				placeholder={field.placeholder}
				rows={3}
				class="mt-1"
			/>
		{:else if field.type === 'select'}
			{@const selectedLabel =
				(field.options ?? []).find((o) => o.value === value)?.label ??
				field.placeholder ??
				'Select...'}
			<Select.Root type="single" value={value as string} onValueChange={(v) => (value = v)}>
				<Select.Trigger id={field.name} class="mt-1 w-full">
					{selectedLabel}
				</Select.Trigger>
				<Select.Content>
					{#each field.options ?? [] as opt, i (i)}
						<Select.Item value={opt.value}>{opt.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		{:else}
			<Input
				id={field.name}
				type={field.type}
				value={value as string}
				oninput={(e) => (value = e.currentTarget.value)}
				placeholder={field.placeholder}
				disabled={field.disabled}
				class="mt-1"
			/>
		{/if}
	{/if}

	{#if field.description}
		<p class="mt-1 text-xs text-muted-foreground">{field.description}</p>
	{/if}
	{#if error}
		<p class="mt-1 text-xs text-destructive">{error}</p>
	{/if}
</div>
