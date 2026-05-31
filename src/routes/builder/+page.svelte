<script lang="ts">
	import '@xyflow/svelte/dist/style.css';
	import { SvelteFlow, Background } from '@xyflow/svelte';
	import { contentManager } from '$lib/store/builder-content.svelte';
	import { nodes } from '$lib/components/nodes/type';
	import { uiManager } from '$lib/store/builder-ui.svelte';
	import ContextMenu from '$lib/components/context-menu/index.svelte';

	let toolbar = $derived(uiManager.toolbar);
</script>

<div class="h-screen w-screen">
	<SvelteFlow
		nodeTypes={nodes}
		bind:nodes={contentManager.nodes}
		bind:edges={contentManager.edges}
		panOnDrag={toolbar.type === 'pan'}
		zoomOnDoubleClick={toolbar.type === 'pan'}
		selectionOnDrag={toolbar.type === 'selection'}
		onpanecontextmenu={uiManager.onPanelContextMenu}
		onnodecontextmenu={uiManager.onNodeContextMenu}
		onedgecontextmenu={uiManager.onEdgeContextMenu}
		onselectioncontextmenu={uiManager.onSelectionContextMenu}
	>
		<Background bgColor="#2A2A2A" patternColor="#E8E8E8" />
		<ContextMenu />
	</SvelteFlow>
</div>
