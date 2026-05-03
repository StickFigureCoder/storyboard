<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	let { data, isConnectable }: NodeProps = $props();
</script>

<Handle type="target" position={Position.Left} {isConnectable} class="h-3 w-3 bg-blue-500" />
<Handle type="source" position={Position.Right} {isConnectable} class="h-3 w-3 bg-indigo-500" />
<Handle type="target" position={Position.Top} {isConnectable} class="h-3 w-3 bg-blue-500" />
<Handle type="source" position={Position.Bottom} {isConnectable} class="h-3 w-3 bg-indigo-500" />

<!-- Your custom UI -->
<div class="rounded-lg border-2 border-indigo-500 bg-white px-4 py-2 text-center shadow-md">
	<div class="text-sm font-bold text-indigo-700">Custom Node</div>

	<!-- Rendering data passed from the main state -->
	<div class="mt-1 text-xs text-gray-600">
		{data.label}
	</div>
</div>
