<script lang="ts">
	import '@xyflow/svelte/dist/style.css';

	import { SvelteFlow, type Node, Background, BackgroundVariant, type Edge } from '@xyflow/svelte';

	import { cn } from '$lib/utils/cn';

	import Toolbar from '$lib/svelteFlow/Toolbar.svelte';
	import Sidebar from '$lib/svelteFlow/Sidebar.svelte';
	import NodeMenu from '$lib/svelteFlow/NodeMenu.svelte';

	let nodes = $state.raw<Node[]>([]);
	let edges = $state.raw<Edge[]>([]);

	let mode = $state<'select' | 'pan'>('select');
	let counter = $state(0);
	let cursorPos = $state<{ x: number; y: number }>({ x: 0, y: 0 });
	let selected = $state<Node | Edge | null>(null);

	let isNodeMenuOpen = $state<boolean>(false);

	const onPaneDoubleClick = (event: MouseEvent) => {
		nodes = [
			...nodes,
			{
				id: 'node_' + counter,
				position: { x: event.clientX, y: event.clientY },
				data: {
					label: 'Node: ' + counter
				}
			}
		];

		counter++;
	};

	const onNodeContextMenu = ({ node, event }: { node: Node; event: MouseEvent }) => {
		event.preventDefault();
		selected = node;
		isNodeMenuOpen = true;
		cursorPos = { x: event.clientX, y: event.clientY };
	};

	const onDelete = (entity: Node | Edge) => {
		nodes = nodes.filter((prob) => entity.id !== prob.id);
		edges = edges.filter((prob) => entity.id !== prob.id);
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
		onnodecontextmenu={onNodeContextMenu}
		onclick={() => {
			isNodeMenuOpen = false;
		}}
		class={cn({ 'selection-mode': mode === 'select' })}
	>
		<Background variant={BackgroundVariant.Dots} bgColor="#101828" patternColor="#f3f4f6" />
		<Toolbar bind:active={mode} />
		<Sidebar isOpen={false} />
		<NodeMenu
			isOpen={isNodeMenuOpen}
			onClose={() => (isNodeMenuOpen = false)}
			pos={cursorPos}
			{selected}
			{onDelete}
		/>
	</SvelteFlow>
</div>
