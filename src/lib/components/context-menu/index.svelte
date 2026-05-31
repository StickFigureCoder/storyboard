<script lang="ts">
	import {
		ContextMenu,
		ContextMenuContent,
		ContextMenuItem,
		ContextMenuLabel,
		ContextMenuSeparator,
		ContextMenuShortcut,
		ContextMenuSub,
		ContextMenuSubContent,
		ContextMenuSubTrigger,
		ContextMenuTrigger
	} from '$lib/components/ui/context-menu';

	let { node = { id: '', title: '', status: '' }, children } = $props();

	function handleAction(action: string) {
		console.log('Action:', action);
	}
</script>

<ContextMenu>
	<ContextMenuTrigger>
		{@render children()}
	</ContextMenuTrigger>

	<ContextMenuContent class="w-52">
		<ContextMenuLabel>Node</ContextMenuLabel>

		<ContextMenuItem onclick={() => handleAction('rename')}>
			Rename node
			<ContextMenuShortcut>R</ContextMenuShortcut>
		</ContextMenuItem>

		<ContextMenuItem onclick={() => handleAction('duplicate')}>
			Duplicate
			<ContextMenuShortcut>D</ContextMenuShortcut>
		</ContextMenuItem>

		<ContextMenuItem onclick={() => handleAction('inspect')}>Inspect output</ContextMenuItem>

		<ContextMenuSeparator />
		<ContextMenuLabel>Connect</ContextMenuLabel>

		<ContextMenuSub>
			<ContextMenuSubTrigger>Add connection</ContextMenuSubTrigger>
			<ContextMenuSubContent class="w-44">
				<ContextMenuItem onclick={() => handleAction('connect')}>Connect to…</ContextMenuItem>
				<ContextMenuItem onclick={() => handleAction('new-node')}>New node here</ContextMenuItem>
			</ContextMenuSubContent>
		</ContextMenuSub>

		<ContextMenuSeparator />
		<ContextMenuLabel>Run</ContextMenuLabel>

		<ContextMenuItem onclick={() => handleAction('run')}>
			Run from here
			<ContextMenuShortcut>⌘↵</ContextMenuShortcut>
		</ContextMenuItem>

		<ContextMenuItem onclick={() => handleAction('rerun')}>Re-run node</ContextMenuItem>

		{#if node.status === 'error'}
			<ContextMenuSeparator />
			<ContextMenuItem onclick={() => handleAction('view-error')}>View error</ContextMenuItem>
		{/if}

		<ContextMenuSeparator />

		<ContextMenuItem
			class="text-destructive focus:bg-destructive/10 focus:text-destructive"
			onclick={() => handleAction('delete')}
		>
			Delete node
			<ContextMenuShortcut>⌫</ContextMenuShortcut>
		</ContextMenuItem>
	</ContextMenuContent>
</ContextMenu>
