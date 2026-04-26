<script lang="ts">
	import { Panel } from '@xyflow/svelte';
	import { blur } from 'svelte/transition';

	let { isOpen = $bindable(true) } = $props();
</script>

<Panel position="center-right" class="mb-6!">
	{#if isOpen}
		<div
			transition:blur
			class="h-[clamp(512px,100svh,calc(100svh-4rem))] w-[clamp(300px,40svw,474px)] rounded-2xl border border-white bg-gray-800 p-4"
		>
			<div class="">
				<h2 class="text-2xl text-white">Start</h2>
			</div>
		</div>
	{/if}
</Panel>
