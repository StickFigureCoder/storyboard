<script lang="ts">
	import '@xyflow/svelte/dist/style.css';
	import { SvelteFlow, type Node, Background, BackgroundVariant } from '@xyflow/svelte';
	import Toolbar from '$lib/svelteFlow/Toolbar.svelte';
	import Sidebar from '$lib/svelteFlow/Sidebar.svelte';
	import { cn } from '$lib/utils/cn';
	let nodes = $state.raw<Node[]>([]);
	let edges = $state.raw([]);

	// The state lives here, and is bound to the Toolbar
	let mode = $state<'select' | 'pan'>('select');
	let counter = $state(0);

	const onPaneDoubleClick = (event: MouseEvent) => {
		nodes = [
			...nodes,
			{
				id: 'node_' + counter,
				position: { x: event.clientX, y: event.clientY },
				data: {
					label: 'Node: ' + nodes.length
				}
			}
		];

		counter++;
	};
</script>

<div class="h-screen w-screen">
	<SvelteFlow
		bind:nodes
		bind:edges
		proOptions={{ hideAttribution: true }}
		panOnDrag={mode === 'pan'}
		selectionOnDrag={mode === 'select'}
		zoomOnDoubleClick={false}
		ondblclick={onPaneDoubleClick}
		class={cn({ 'selection-mode': mode === 'select' })}
	>
		<Background variant={BackgroundVariant.Dots} bgColor="#101828" patternColor="#f3f4f6" />
		<Toolbar bind:active={mode} />
		<Sidebar />
	</SvelteFlow>
</div>
