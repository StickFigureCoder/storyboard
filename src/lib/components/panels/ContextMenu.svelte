<script lang="ts">
	import type { Component } from 'svelte';
	import type { LucideProps } from '@lucide/svelte';
	import {
		FilePlus,
		Copy,
		Clipboard,
		Pencil,
		Trash2,
		ArrowRightLeft,
		Group,
		TextAlignCenter,
		LayoutGrid,
		Maximize2,
		Lock,
		EyeOff,
		Ungroup
	} from '@lucide/svelte';

	import { outsideclick } from '$lib/hooks/outsideclick';
	import { builder } from '../state/builder.svelte';

	type IconComponent = Component<LucideProps>;
	interface MenuItem {
		label: string;
		iconLeft?: IconComponent;
		iconRight?: IconComponent;
		shortcut?: string;
		disabled?: boolean;
		danger?: boolean;
		onClick?: () => void;
	}

	type MenuSeparator = { separator: true };
	type MenuEntry = MenuItem | MenuSeparator;
	type ContextType = 'node' | 'edge' | 'panel' | 'selection';

	function isSeparator(entry: MenuEntry): entry is MenuSeparator {
		return 'separator' in entry;
	}

	let isOpen = $derived(!!builder.ctxMenuMode);
	let position = $derived(builder.ctxMenuMode?.pos || { x: 200, y: 200 });
	let contextType = $derived(builder.ctxMenuMode?.type);
	let targetLabel = $derived(builder.ctxMenuMode?.type);

	const onClose = () => {		
		builder.ctxMenuMode = null;
	};

	const onAction = (action: string) => {
		console.log(action);
	};

	const nodeMenu: MenuEntry[] = [
		{ label: 'Edit label', iconLeft: Pencil, onClick: () => onAction('edit-label') },
		{ label: 'Duplicate', iconLeft: Copy, shortcut: '⌘D', onClick: () => onAction('duplicate') },
		{ label: 'Connect from here', iconLeft: ArrowRightLeft, onClick: () => onAction('connect') },
		{ separator: true },
		{ label: 'Lock position', iconLeft: Lock, onClick: () => onAction('lock') },
		{ label: 'Hide node', iconLeft: EyeOff, onClick: () => onAction('hide') },
		{ label: 'Fit to node', iconLeft: Maximize2, onClick: () => onAction('fit') },
		{ separator: true },
		{
			label: 'Delete node',
			iconLeft: Trash2,
			shortcut: '⌫',
			danger: true,
			onClick: () => onAction('delete')
		}
	];

	const edgeMenu: MenuEntry[] = [
		{ label: 'Edit label', iconLeft: Pencil, onClick: () => onAction('edit-label') },
		{ label: 'Reverse direction', iconLeft: ArrowRightLeft, onClick: () => onAction('reverse') },
		{ separator: true },
		{
			label: 'Delete edge',
			iconLeft: Trash2,
			shortcut: '⌫',
			danger: true,
			onClick: () => onAction('delete')
		}
	];

	const panelMenu: MenuEntry[] = [
		{ label: 'Add node here', iconLeft: FilePlus, onClick: () => onAction('add-node') },
		{ label: 'Paste', iconLeft: Clipboard, shortcut: '⌘V', onClick: () => onAction('paste') },
		{ separator: true },
		{ label: 'Auto layout', iconLeft: LayoutGrid, onClick: () => onAction('auto-layout') },
		{
			label: 'Fit view',
			iconLeft: Maximize2,
			shortcut: '⌘⇧F',
			onClick: () => onAction('fit-view')
		},
		{ separator: true },
		{ label: 'Select all', iconLeft: Group, shortcut: '⌘A', onClick: () => onAction('select-all') }
	];

	const selectionMenu: MenuEntry[] = [
		{ label: 'Copy', iconLeft: Copy, shortcut: '⌘C', onClick: () => onAction('copy') },
		{ label: 'Duplicate', iconLeft: Copy, shortcut: '⌘D', onClick: () => onAction('duplicate') },
		{ label: 'Group', iconLeft: Group, onClick: () => onAction('group') },
		{ label: 'Ungroup', iconLeft: Ungroup, onClick: () => onAction('ungroup') },
		{ separator: true },
		{ label: 'Align centers', iconLeft: TextAlignCenter, onClick: () => onAction('align') },
		{ separator: true },
		{
			label: 'Delete selection',
			iconLeft: Trash2,
			shortcut: '⌫',
			danger: true,
			onClick: () => onAction('delete')
		}
	];

	const menuMap: Record<ContextType, MenuEntry[]> = {
		node: nodeMenu,
		edge: edgeMenu,
		panel: panelMenu,
		selection: selectionMenu
	};

	const badgeMap: Record<ContextType, string> = {
		node: 'Node',
		edge: 'Edge',
		panel: 'Canvas',
		selection: 'Selection'
	};

	let menuEntries = $derived(menuMap[contextType || 'panel']);
	let badgeLabel = $derived(badgeMap[contextType || 'panel']);

	function handleItemClick(item: MenuItem) {
		if (item.disabled) return;
		item.onClick?.();
		onClose();
	}
</script>

{#if isOpen}
	<div
		use:outsideclick
		onoutsideclick={onClose}
		class="fixed z-50"
		style="left:{position.x}px;top:{position.y}px;"
	>
		<ul
			class="w-56 rounded-lg border border-gray-700 bg-gray-900 p-1 text-sm text-gray-200 shadow-xl"
		>
			<!-- Header -->
			<li class="mb-1 flex items-center gap-2 border-b border-gray-700 px-2 py-1.5">
				<span
					class="rounded-full px-2 py-0.5 text-xs font-medium
					{contextType === 'node' ? 'bg-blue-950 text-blue-300' : ''}
					{contextType === 'edge' ? 'bg-amber-950 text-amber-300' : ''}
					{contextType === 'panel' ? 'bg-green-950 text-green-300' : ''}
					{contextType === 'selection' ? 'bg-purple-950 text-purple-300' : ''}
				"
				>
					{badgeLabel}
				</span>
				{#if targetLabel}
					<span class="truncate text-xs text-gray-400">{targetLabel}</span>
				{/if}
			</li>

			{#each menuEntries as entry, i (i)}
				{#if isSeparator(entry)}
					<li class="mx-2 my-1 border-t border-gray-700/60"></li>
				{:else}
					<li>
						<button
							onclick={() => handleItemClick(entry)}
							disabled={entry.disabled}
							class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors duration-100
								{entry.disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}
								{entry.danger
								? 'text-red-400 hover:bg-red-950/60 hover:text-red-300'
								: 'hover:bg-gray-700/60 hover:text-white'}
							"
						>
							{#if entry.iconLeft}
								<entry.iconLeft
									size={15}
									class="shrink-0 {entry.danger ? 'text-red-400' : 'text-gray-400'}"
								/>
							{/if}

							<span class="flex-1">{entry.label}</span>

							{#if entry.shortcut}
								<span class="text-xs text-gray-500">{entry.shortcut}</span>
							{/if}

							{#if entry.iconRight}
								<entry.iconRight size={13} class="shrink-0 text-gray-500" />
							{/if}
						</button>
					</li>
				{/if}
			{/each}
		</ul>
	</div>
{/if}
