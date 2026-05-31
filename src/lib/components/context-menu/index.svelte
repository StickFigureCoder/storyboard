<script lang="ts">
	import { uiManager } from '$lib/store/builder-ui.svelte';
	import { getMenu, type MenuEntry } from './menu';

	let open = $derived(!!uiManager.ctxMenu);
	let x = $derived(uiManager.ctxMenu?.position.x ?? 0);
	let y = $derived(uiManager.ctxMenu?.position.y ?? 0);
	let submenu = $state<string | null>(null);
	let submenuY = $state(0);
	const menu: MenuEntry[] = $derived(getMenu(uiManager.ctxMenu?.type));

	// The menu element — used to measure width for flyout offset
	let menuEl = $state<HTMLDivElement | null>(null);

	function close() {
		uiManager.ctxMenu = null;
		submenu = null;
	}

	function handleAction(action: string) {
		console.log('Action:', action);
		close();
	}

	function onSubmenuEnter(label: string, triggerEl: HTMLButtonElement) {
		submenu = label;
		// Align flyout vertically with the trigger row
		const rect = triggerEl.getBoundingClientRect();
		submenuY = rect.top;
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}

	// ── Shared classes ───────────────────────────────────────────────────────
	const itemCls =
		'flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground cursor-default select-none';
	const destructiveCls =
		'flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm text-destructive outline-none hover:bg-destructive/10 hover:text-destructive focus-visible:bg-destructive/10 focus-visible:text-destructive cursor-default select-none';
</script>

<svelte:window onkeydown={onKeydown} />

{#if open}
	<div class="fixed inset-0 z-40" onclick={close} role="presentation"></div>

	<!-- Main menu -->
	<div
		bind:this={menuEl}
		class="fixed z-50 min-w-52 animate-in overflow-visible rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md fade-in-0 zoom-in-95"
		style="left: {x}px; top: {y}px"
		role="menu"
		aria-label="Node actions"
	>
		{#each menu as entry, index (index)}
			{#if entry.type === 'separator'}
				<div class="-mx-1 my-1 h-px bg-border"></div>
			{:else if entry.type === 'label'}
				<p
					class="px-2 py-1.5 text-[0.7rem] font-semibold tracking-widest text-muted-foreground uppercase select-none"
				>
					{entry.label}
				</p>
			{:else if entry.type === 'item'}
				<button
					class={entry.destructive ? destructiveCls : itemCls}
					role="menuitem"
					onclick={() => handleAction(entry.action)}
					onmouseenter={() => (submenu = null)}
				>
					{entry.label}
					{#if entry.shortcut}
						<kbd class="ml-auto text-[0.7rem] {entry.destructive ? '' : 'text-muted-foreground'}">
							{entry.shortcut}
						</kbd>
					{/if}
				</button>
			{:else if entry.type === 'submenu'}
				<button
					class="{itemCls} {submenu === entry.label ? 'bg-accent text-accent-foreground' : ''}"
					role="menuitem"
					aria-haspopup="true"
					aria-expanded={submenu === entry.label}
					onmouseenter={(e) => onSubmenuEnter(entry.label, e.currentTarget)}
				>
					{entry.label}
					<svg class="ml-auto h-3 w-3 text-muted-foreground" viewBox="0 0 12 12" fill="none">
						<path
							d="M2.5 2.5L7 6l-4.5 3.5"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
			{/if}
		{/each}
	</div>

	<!-- Flyout submenu — portalled to fixed, positioned beside main menu -->
	{#if submenu !== null}
		{@const submenuIndex = menu.findIndex((e) => e.type === 'submenu' && e.label === submenu)}
		{#if submenuIndex != -1 && menu[submenuIndex].type === 'submenu'}
			<div
				class="fixed z-50 min-w-44 animate-in rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md fade-in-0 zoom-in-95"
				style="left: {x + (menuEl?.offsetWidth ?? 208) + 4}px; top: {submenuY}px"
				tabindex={submenuIndex}
				role="menu"
				onmouseenter={() => (submenu = submenu)}
				onmouseleave={() => (submenu = null)}
			>
				{#each menu[submenuIndex].children as child, index (index)}
					<button
						class={child.destructive ? destructiveCls : itemCls}
						role="menuitem"
						onclick={() => handleAction(child.action)}
					>
						{child.label}
						{#if child.shortcut}
							<kbd class="ml-auto text-[0.7rem] text-muted-foreground">{child.shortcut}</kbd>
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	{/if}
{/if}
