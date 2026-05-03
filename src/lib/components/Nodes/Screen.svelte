<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	let { isConnectable }: NodeProps = $props();
</script>

<Handle type="target" position={Position.Left} {isConnectable} class="h-3 w-3 bg-blue-500" />
<Handle type="source" position={Position.Right} {isConnectable} class="h-3 w-3 bg-indigo-500" />
<Handle type="target" position={Position.Top} {isConnectable} class="h-3 w-3 bg-blue-500" />
<Handle type="source" position={Position.Bottom} {isConnectable} class="h-3 w-3 bg-indigo-500" />

<!-- Your custom UI -->
<div class="w-[240px] rounded-2xl bg-gray-300">
	<div class="relative aspect-video w-full overflow-hidden rounded-2xl">
		<img
			src="/images/foggy-town.png"
			alt="Placeholder"
			class="inset-0 h-full w-full object-cover"
		/>
	</div>
</div>
