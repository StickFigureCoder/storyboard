<script lang="ts">
	import '@xyflow/svelte/dist/style.css';

	import { SvelteFlow, Background } from '@xyflow/svelte';

	import Sidebar from '$lib/components/panels/Sidebar.svelte';
	import Toolbar from '$lib/components/panels/Toolbar.svelte';
	import ContextMenu from '$lib/components/panels/ContextMenu.svelte';

	import { builder } from '$lib/components/state/builder.svelte';
	import { nodeTypes } from '$lib/components/Nodes';
</script>

<div class="h-screen w-screen">
	<SvelteFlow
		{nodeTypes}
		bind:nodes={builder.nodes}
		bind:edges={builder.edges}
		panOnDrag={builder.toolbarMode.type === 'pan'}
		zoomOnDoubleClick={builder.toolbarMode.type === 'pan'}
		selectionOnDrag={builder.toolbarMode.type === 'selection'}
		// Event Handlers
		// GLOBAL & LIFECYCLE
		oninit={builder.onInit}
		onerror={builder.onError}
		ondblclick={builder.onDBLClick}
		// NODES
		onnodeclick={builder.onNodeClick}
		onnodecontextmenu={builder.onNodeContextMenu}
		onnodedragstart={builder.onNodeDragStart}
		onnodedragstop={builder.onNodeDragStop}
		// EDGES
		onedgeclick={builder.onEdgeClick}
		onedgecontextmenu={builder.onEdgeContextMenu}
		// PANE (BACKGROUND)
		onpaneclick={builder.onPaneClick}
		onpanecontextmenu={builder.onPaneContextMenu}
		// CONNECTIONS
		onconnectstart={builder.onConnectStart}
		onconnect={builder.onConnect}
		onconnectend={builder.onConnectEnd}
		// SELECTIONS
		onselectionclick={builder.onSelectionClick}
		onselectioncontextmenu={builder.onSelectionContextMenu}
		onselectionstart={builder.onSelectionStart}
		onselectionend={builder.onSelectionEnd}
		onselectionchange={builder.onSelectionChange}
		onselectiondragstart={builder.onSelectionDragStart}
		onselectiondragstop={builder.onSelectionDragStop}
		// VIEWPORT / MOVEMENT
		onmovestart={builder.onMoveStart}
		onmoveend={builder.onMoveEnd}
		// STATE / DELETION
		ondelete={builder.onDelete}
	>
		<Background bgColor="#101828" patternColor="#f3f4f6" />
		<ContextMenu />
		<Toolbar />
		<Sidebar />
	</SvelteFlow>
</div>
