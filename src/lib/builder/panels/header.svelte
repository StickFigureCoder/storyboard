<script lang="ts">
	import { Panel } from '@xyflow/svelte';
</script>

<Panel position="top-center" class="mt-4">
	<div
		class="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-2 px-4 shadow-2xl backdrop-blur-xl"
	>
		<div class="flex flex-col px-2">
			<span class="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">Project</span>
			<span class="text-sm font-semibold">Flow Template</span>
		</div>
		<div class="h-8 w-px bg-white/10"></div>
		<button
			class="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium transition-all hover:scale-105 hover:bg-indigo-500 active:scale-95"
		>
			<span>Add Node</span>
		</button>
		<button
			class="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium transition-all hover:bg-white/5"
		>
			Reset
		</button>
	</div>
</Panel>
