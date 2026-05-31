<script lang="ts">
	import { uiManager } from '$lib/store/builder-ui.svelte';

	type MenuAction =
		| 'rename'
		| 'duplicate'
		| 'inspect'
		| 'connect'
		| 'new-node'
		| 'run'
		| 'rerun'
		| 'delete';

	let open = $derived(!!uiManager.ctxMenu);
	let x = $derived(uiManager.ctxMenu?.position.x ?? 0);
	let y = $derived(uiManager.ctxMenu?.position.y ?? 0);
	let connectOpen = $state(false);

	function close() {
		uiManager.ctxMenu = null;
		connectOpen = false;
	}

	function handleAction(action: MenuAction) {
		console.log('Action:', action);
		close();
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if open}
	<div class="fixed inset-0 z-40" onclick={close} role="presentation"></div>

	<div
		class="fixed z-50 min-w-52 animate-in overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md fade-in-0 zoom-in-95"
		style="left: {x}px; top: {y}px"
		role="menu"
		aria-label="Node actions"
	>
		<!-- Node -->
		<p
			class="px-2 py-1.5 text-[0.7rem] font-semibold tracking-widest text-muted-foreground uppercase select-none"
		>
			Node
		</p>

		<button
			class="flex w-full cursor-default items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
			role="menuitem"
			onclick={() => handleAction('rename')}
		>
			Rename node
			<kbd class="ml-auto text-[0.7rem] text-muted-foreground">R</kbd>
		</button>

		<button
			class="flex w-full cursor-default items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
			role="menuitem"
			onclick={() => handleAction('duplicate')}
		>
			Duplicate
			<kbd class="ml-auto text-[0.7rem] text-muted-foreground">D</kbd>
		</button>

		<button
			class="flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
			role="menuitem"
			onclick={() => handleAction('inspect')}
		>
			Inspect output
		</button>

		<div class="-mx-1 my-1 h-px bg-border"></div>

		<!-- Connect -->
		<p
			class="px-2 py-1.5 text-[0.7rem] font-semibold tracking-widest text-muted-foreground uppercase select-none"
		>
			Connect
		</p>

		<button
			class="flex w-full cursor-default items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
			role="menuitem"
			aria-haspopup="true"
			aria-expanded={connectOpen}
			onclick={(e) => {
				e.stopPropagation();
				connectOpen = !connectOpen;
			}}
		>
			Add connection
			<svg
				class="ml-auto h-3 w-3 text-muted-foreground transition-transform duration-150 {connectOpen
					? 'rotate-90'
					: ''}"
				viewBox="0 0 12 12"
				fill="none"
			>
				<path
					d="M4.5 2.5L8 6l-3.5 3.5"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>

		{#if connectOpen}
			<div class="ml-2 border-l border-border pl-2">
				<button
					class="flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
					role="menuitem"
					onclick={() => handleAction('connect')}
				>
					Connect to…
				</button>
				<button
					class="flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
					role="menuitem"
					onclick={() => handleAction('new-node')}
				>
					New node here
				</button>
			</div>
		{/if}

		<div class="-mx-1 my-1 h-px bg-border"></div>

		<!-- Run -->
		<p
			class="px-2 py-1.5 text-[0.7rem] font-semibold tracking-widest text-muted-foreground uppercase select-none"
		>
			Run
		</p>

		<button
			class="flex w-full cursor-default items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
			role="menuitem"
			onclick={() => handleAction('run')}
		>
			Run from here
			<kbd class="ml-auto text-[0.7rem] text-muted-foreground">⌘↵</kbd>
		</button>

		<button
			class="flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
			role="menuitem"
			onclick={() => handleAction('rerun')}
		>
			Re-run node
		</button>

		<div class="-mx-1 my-1 h-px bg-border"></div>

		<!-- Destructive -->
		<button
			class="flex w-full cursor-default items-center justify-between rounded-sm px-2 py-1.5 text-sm text-destructive outline-none select-none hover:bg-destructive/10 hover:text-destructive focus-visible:bg-destructive/10 focus-visible:text-destructive"
			role="menuitem"
			onclick={() => handleAction('delete')}
		>
			Delete node
			<kbd class="ml-auto text-[0.7rem]">⌫</kbd>
		</button>
	</div>
{/if}
