<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	let { isConnectable }: NodeProps = $props();
</script>

<Handle 
	type="target" 
	position={Position.Left} 
	{isConnectable} 
	class="z-20 h-3 w-3 bg-blue-500" 
/>
<Handle
	type="source"
	position={Position.Right}
	{isConnectable}
	class="z-20 h-3 w-3 bg-indigo-500"
/>
<Handle 
	type="target" 
	position={Position.Top} 
	{isConnectable} 
	class="z-20 h-3 w-3 bg-blue-500" 
/>
<Handle
	type="source"
	position={Position.Bottom}
	{isConnectable}
	class="z-20 h-3 w-3 bg-indigo-500"
/>

<!-- Your custom UI -->
<div class="w-[240px] rounded-2xl bg-gray-800">
	<div class="relative aspect-video w-full overflow-hidden rounded-t-2xl">
		<img
			src="/images/foggy-town.png"
			alt="Placeholder"
			class="inset-0 h-full w-full object-cover"
		/>
		{#if false}
			<div
				class="absolute inset-0 flex items-center justify-center bg-gray-100 text-xs text-gray-400"
			>
				No image
			</div>
		{/if}
	</div>
	<div class="px-2 pb-2">
		<h4 class="text-sm font-bold py-2 text-white">Hello world</h4>
		<p class="text-xs font-light text-gray-300">
			A node representing a component in your design token pipeline. Connect to output systems.
		</p>
	</div>
</div>
