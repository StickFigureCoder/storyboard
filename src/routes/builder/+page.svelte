<script lang="ts">
	import '@xyflow/svelte/dist/style.css';
	import { SvelteFlow, Background } from '@xyflow/svelte';
	import { contentManager } from '$lib/store/builder-content.svelte';
	import { nodes } from '$lib/components/nodes/type';
</script>

<div class="h-screen w-screen">
	<SvelteFlow nodeTypes={nodes} bind:nodes={contentManager.nodes} bind:edges={contentManager.edges}>
		<Background bgColor="#2A2A2A" patternColor="#E8E8E8" />
	</SvelteFlow>
</div>
