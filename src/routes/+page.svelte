<script lang="ts">
	import '@xyflow/svelte/dist/style.css';

	import { SvelteFlow, Background } from '@xyflow/svelte';

	import Sidebar from '$lib/components/panels/Sidebar.svelte';
	import Toolbar from '$lib/components/panels/Toolbar.svelte';
	import ContextMenu from '$lib/components/panels/ContextMenu.svelte';

	import {
		onConnect,
		onConnectEnd,
		onConnectStart,
		onDBLClick,
		onDelete,
		onEdgeClick,
		onEdgeContextMenu,
		onError,
		onInit,
		onMoveEnd,
		onMoveStart,
		onNodeClick,
		onNodeContextMenu,
		onNodeDragStart,
		onNodeDragStop,
		onPaneClick,
		onPaneContextMenu,
		onSelectionChange,
		onSelectionClick,
		onSelectionContextMenu,
		onSelectionDragStart,
		onSelectionDragStop,
		onSelectionEnd,
		onSelectionStart
	} from '$lib/components/state/builder.svelte';

	import { board } from '$lib/components/state/builder.svelte';
	import { nodeTypes } from '$lib/components/Nodes';
</script>

<div class="h-screen w-screen">
	<SvelteFlow
		nodeTypes={nodeTypes}
		bind:nodes={board.nodes}
		bind:edges={board.edges}
		panOnDrag={board.panOnDrag}
		selectionOnDrag={board.selectionOnDrag}
		zoomOnDoubleClick={board.zoomOnDoubleClick}
		// Event Handlers
		// GLOBAL & LIFECYCLE
		oninit={onInit}
		onerror={onError}
		ondblclick={onDBLClick}
		// NODES
		onnodeclick={onNodeClick}
		onnodecontextmenu={onNodeContextMenu}
		onnodedragstart={onNodeDragStart}
		onnodedragstop={onNodeDragStop}
		// EDGES
		onedgeclick={onEdgeClick}
		onedgecontextmenu={onEdgeContextMenu}
		// PANE (BACKGROUND)
		onpaneclick={onPaneClick}
		onpanecontextmenu={onPaneContextMenu}
		// CONNECTIONS
		onconnectstart={onConnectStart}
		onconnect={onConnect}
		onconnectend={onConnectEnd}
		// SELECTIONS
		onselectionclick={onSelectionClick}
		onselectioncontextmenu={onSelectionContextMenu}
		onselectionstart={onSelectionStart}
		onselectionend={onSelectionEnd}
		onselectionchange={onSelectionChange}
		onselectiondragstart={onSelectionDragStart}
		onselectiondragstop={onSelectionDragStop}
		// VIEWPORT / MOVEMENT
		onmovestart={onMoveStart}
		onmoveend={onMoveEnd}
		// STATE / DELETION
		ondelete={onDelete}
	>
		<Background bgColor="#101828" patternColor="#f3f4f6" />
		<ContextMenu />
		<Toolbar />
		<Sidebar />
	</SvelteFlow>
</div>
