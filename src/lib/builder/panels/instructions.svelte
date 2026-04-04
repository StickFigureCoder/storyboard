<script lang="ts">
	import { Panel } from '@xyflow/svelte';

	let { nodes } = $props();
</script>

<!-- Side Sidebar Panel -->
<Panel position="top-left" class="mt-20 ml-4 hidden md:block">
	<div
		class="w-64 space-y-4 rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md"
	>
		<h3 class="font-bold text-white">Instructions</h3>
		<p class="text-xs leading-relaxed text-slate-400">
			This template uses <b>Svelte 5 Runes</b> and <b>Tailwind CSS</b>. Modify the
			<code>nodes</code> state to increment the UI.
		</p>
		<div class="space-y-2">
			<div class="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
				<span>Active Nodes</span>
				<span>{nodes.length}</span>
			</div>
			<div class="h-1 w-full overflow-hidden rounded-full bg-slate-800">
				<div
					class="h-full bg-indigo-500 transition-all duration-500"
					style="width: {(nodes.length / 20) * 100}%"
				></div>
			</div>
		</div>
	</div>
</Panel>
