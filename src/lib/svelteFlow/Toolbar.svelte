<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { MousePointer2, Hand, ZoomIn, ZoomOut, Maximize } from '@lucide/svelte';
	import { Panel, useSvelteFlow } from '@xyflow/svelte';

	// Svelte 5: Allow the main page to bind to this state
	let { active = $bindable('select') } = $props();

	// This gives us absolute control over the canvas viewport!
	const { zoomIn, zoomOut, fitView } = useSvelteFlow();

	const baseBtnClass =
		'flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200';
	const inactiveBtnClass = 'text-gray-500 hover:bg-gray-100 hover:text-gray-900';
	const activeBtnClass = 'bg-blue-50 text-blue-600';
</script>

<Panel position="bottom-center" class="mb-6!">
	<div class="flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1.5 shadow-lg">
		<!-- Select Tool -->
		<button
			class={cn(baseBtnClass, active === 'select' ? activeBtnClass : inactiveBtnClass)}
			onclick={() => (active = 'select')}
			title="Select"
		>
			<MousePointer2 size={18} strokeWidth={2.5} />
		</button>

		<!-- Pan (Hand) Tool -->
		<button
			class={cn(baseBtnClass, active === 'pan' ? activeBtnClass : inactiveBtnClass)}
			onclick={() => (active = 'pan')}
			title="Pan Canvas"
		>
			<Hand size={18} strokeWidth={2.5} />
		</button>

		<div class="mx-1 h-6 w-px bg-gray-200"></div>

		<!-- Zoom In -->
		<!-- Added a 300ms duration for a buttery smooth Figma-like zoom -->
		<button
			class={cn(baseBtnClass, inactiveBtnClass)}
			onclick={() => zoomIn({ duration: 300 })}
			title="Zoom In"
		>
			<ZoomIn size={18} strokeWidth={2.5} />
		</button>

		<!-- Zoom Out -->
		<button
			class={cn(baseBtnClass, inactiveBtnClass)}
			onclick={() => zoomOut({ duration: 300 })}
			title="Zoom Out"
		>
			<ZoomOut size={18} strokeWidth={2.5} />
		</button>

		<!-- Fit to Screen -->
		<!-- padding: 0.2 ensures the nodes don't touch the absolute edges of your screen -->
		<button
			class={cn(baseBtnClass, inactiveBtnClass)}
			onclick={() => fitView({ duration: 300, padding: 0.2 })}
			title="Fit to Screen"
		>
			<Maximize size={18} strokeWidth={2.5} />
		</button>
	</div>
</Panel>
