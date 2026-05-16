<script lang="ts">
	import { Handle, Position } from '@xyflow/svelte';
	import type { ScreenProps } from './type';

	let { data, isConnectable }: ScreenProps = $props();
	let { image, title, description } = $derived(data);
</script>

<Handle type="target" position={Position.Left} {isConnectable} class="z-20 h-3 w-3 bg-blue-500" />
<Handle
	type="source"
	position={Position.Right}
	{isConnectable}
	class="z-20 h-3 w-3 bg-indigo-500"
/>
<Handle type="target" position={Position.Top} {isConnectable} class="z-20 h-3 w-3 bg-blue-500" />
<Handle
	type="source"
	position={Position.Bottom}
	{isConnectable}
	class="z-20 h-3 w-3 bg-indigo-500"
/>

<!-- Your custom UI -->
<div class="w-[240px] rounded-2xl bg-gray-800">
	<div class="relative aspect-video w-full overflow-hidden rounded-t-2xl">
		{#if image}
			<img alt={image.alt} src={image.src} class="inset-0 h-full w-full object-cover" />
		{:else}
			<div
				class="absolute inset-0 flex items-center justify-center bg-gray-100 text-xs text-gray-400"
			>
				No image
			</div>
		{/if}
	</div>
	<div class="px-2 pb-2">
		<h4 class="py-2 text-sm font-bold text-white">{title}</h4>
		<p class="text-xs font-light text-gray-300">
			{description}
		</p>
	</div>
</div>
