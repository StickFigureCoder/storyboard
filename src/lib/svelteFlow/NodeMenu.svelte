<script lang="ts">
	let { isOpen = false, onClose, selected, onDelete, pos = { x: 50, y: 50 } } = $props();
</script>

{#if isOpen}
	<div
		class="fixed z-50 w-40 rounded-md border border-gray-200 bg-gray-900 py-1 text-sm font-medium text-gray-100 shadow-xl"
		style="left: {pos.x}px; top: {pos.y}px;"
	>
		<button
			class="w-full px-4 py-2 text-left text-red-600 transition-colors hover:bg-gray-100"
			onclick={() => {
				onDelete(selected);
				onClose();
			}}
		>
			Delete Node
		</button>
	</div>
{/if}
