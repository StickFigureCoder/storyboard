<script>
	import { Background, BackgroundVariant, SvelteFlow, Controls, MiniMap } from '@xyflow/svelte';

	// CSS import is required for default styling
	import '@xyflow/svelte/dist/style.css';

	// 1. Initialize nodes and edges using the $state rune
	let nodes = $state([
		{
			id: '1',
			type: 'input',
			data: { label: 'Svelte 5 Node' },
			position: { x: 250, y: 0 }
		},
		{
			id: '2',
			data: { label: 'Reactive State' },
			position: { x: 100, y: 100 }
		},
		{
			id: '3',
			type: 'output',
			data: { label: 'Output' },
			position: { x: 400, y: 100 }
		}
	]);

	let edges = $state([
		{ id: 'e1-2', source: '1', target: '2', animated: true },
		{ id: 'e1-3', source: '1', target: '3' }
	]);
</script>

<main class="h-screen w-full bg-slate-950 font-sans">
	<SvelteFlow 
		{nodes} 
		{edges} 
		fitView 
		colorMode="dark"
	>
		<Background 
			variant={BackgroundVariant.Dots} 
			gap={20} 
			size={1} 
			patternColor="#334155" 
		/>
		<Controls />
		<MiniMap />
	</SvelteFlow>
</main>