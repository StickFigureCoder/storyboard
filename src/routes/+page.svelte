<script lang="ts">
	import '@xyflow/svelte/dist/style.css';
	import { SvelteFlow, type Node, Background, BackgroundVariant } from '@xyflow/svelte';
	import Toolbar from '$lib/svelteFlow/Toolbar.svelte';

	let nodes = $state<Node[]>([]);
	let edges = $state([{ id: 'e1-2', source: '1', target: '2' }]);

	// The state lives here, and is bound to the Toolbar
	let active = $state<'select' | 'pan'>('select');
</script>

<div class="h-screen w-screen">
	<SvelteFlow
		bind:nodes
		bind:edges
		proOptions={{ hideAttribution: true }}
		panOnDrag={active === 'pan'}
		selectionOnDrag={active === 'select'}
	>
		<Background variant={BackgroundVariant.Dots} bgColor="#101828" patternColor="#f3f4f6" />

		<!-- Drop the toolbar inside SvelteFlow so it has access to the canvas -->
		<Toolbar bind:active />
	</SvelteFlow>
</div>
