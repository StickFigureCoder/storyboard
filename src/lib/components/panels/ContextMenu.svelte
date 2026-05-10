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

	import { outsideclick } from '$lib/hooks/outsideclick.svelte';
	import { builder } from '../state/builder.svelte';
	import type { ScreenNode } from '../Nodes/Screen/type';

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

	// prettier-ignore
	const nodeMenu: MenuEntry[] = [
		{ label: 'Edit label',        iconLeft: Pencil,          onClick: () => onAction('edit-label')                               },
		{ label: 'Duplicate',         iconLeft: Copy,            onClick: () => onAction('duplicate'),  shortcut: '⌘D',             },
		{ separator: true                                                                                                            },
		{ label: 'Connect from here', iconLeft: ArrowRightLeft,  onClick: () => onAction('connect')                                  },
		{ label: 'Lock position',     iconLeft: Lock,            onClick: () => onAction('lock')                                     },
		{ label: 'Hide node',         iconLeft: EyeOff,          onClick: () => onAction('hide')                                     },
		{ label: 'Fit to node',       iconLeft: Maximize2,       onClick: () => onAction('fit')                                      },
		{ separator: true                                                                                                            },
		{ label: 'Delete node',       iconLeft: Trash2,          onClick: () => onAction('delete'),     shortcut: '⌫', danger: true }
	];

	// prettier-ignore
	const edgeMenu: MenuEntry[] = [
		{ label: 'Edit label',        iconLeft: Pencil,          onClick: () => onAction('edit-label')                               },
		{ label: 'Reverse direction', iconLeft: ArrowRightLeft,  onClick: () => onAction('reverse')                                  },
		{ separator: true                                                                                                            },
		{ label: 'Delete edge',       iconLeft: Trash2,          onClick: () => onAction('delete'),     shortcut: '⌫', danger: true }
	];

	// prettier-ignore
	const panelMenu: MenuEntry[] = [
		{ label: 'Add node here',     iconLeft: FilePlus,        onClick: () => onAction('add-node')                                 },
		{ label: 'Paste',             iconLeft: Clipboard,       onClick: () => onAction('paste'),      shortcut: '⌘V',             },
		{ separator: true                                                                                                            },
		{ label: 'Auto layout',       iconLeft: LayoutGrid,      onClick: () => onAction('auto-layout')                              },
		{ label: 'Fit view',          iconLeft: Maximize2,       onClick: () => onAction('fit-view'),   shortcut: '⌘⇧F'             },
		{ separator: true                                                                                                            },
		{ label: 'Select all',        iconLeft: Group,           onClick: () => onAction('select-all'), shortcut: '⌘A'              }
	];

	// prettier-ignore
	const selectionMenu: MenuEntry[] = [
		{ label: 'Copy',              iconLeft: Copy,            onClick: () => onAction('copy'),       shortcut: '⌘C',             },
		{ label: 'Duplicate',         iconLeft: Copy,            onClick: () => onAction('duplicate'),  shortcut: '⌘D',             },
		{ label: 'Group',             iconLeft: Group,           onClick: () => onAction('group')                                    },
		{ label: 'Ungroup',           iconLeft: Ungroup,         onClick: () => onAction('ungroup'),                                 },
		{ separator: true                                                                                                            },
		{ label: 'Align centers',     iconLeft: TextAlignCenter, onClick: () => onAction('align')                                    },
		{ separator: true                                                                                                            }, 
		{ label: 'Delete selection',  iconLeft: Trash2,          onClick: () => onAction('delete'),     shortcut: '⌫', danger: true }
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

	let isOpen = $derived(!!builder.ctxMenuMode);
	let position = $derived(builder.ctxMenuMode?.pos || { x: 200, y: 200 });
	let contextType = $derived(builder.ctxMenuMode?.type);
	let targetLabel = $derived(builder.ctxMenuMode?.type);

	let menuEntries = $derived(menuMap[contextType || 'panel']);
	let badgeLabel = $derived(badgeMap[contextType || 'panel']);

	const isSeparator = (entry: MenuEntry): entry is MenuSeparator => {
		return 'separator' in entry;
	};

	const onClose = () => {
		builder.ctxMenuMode = null;
	};

	const handleClick = (item: MenuItem) => {
		if (item.disabled) return;
		item.onClick?.();
		onClose();
	};

	const onAction = (action: string) => {
		if (!builder.ctxMenuMode) return;

		const pos = builder.ctxMenuMode.pos;

		switch (action) {
			case 'add-node': {
				const data: ScreenNode = {
					title: 'This is a test',
					image: { src: '/images/empire.png', alt: 'This is the alt' },
					description: 'This is the description'
				};
				builder.addNode({
					type: 'screen',
					data,
					position: pos
				});
				break;
			}
			case 'delete': {
				if (builder.ctxMenuMode.type === 'node') {
					builder.deleteNode(builder.ctxMenuMode.node);
				}
				break;
			}
		}
	};
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
							onclick={() => handleClick(entry)}
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
