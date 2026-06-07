<script>
	import { resolve } from '$app/paths';
	import { CURRENT_VERSION } from '$lib';
	import { downloadWorld } from '$lib/components/serde';
</script>

<div class="flex h-screen w-screen items-center justify-center gap-4">
	<a class="font-light underline duration-300 hover:font-bold" href={resolve('/builder')}>Builder</a
	>
	<p>or</p>
	<a class="font-light underline duration-300 hover:font-bold" href={resolve('/player')}>Player</a>

	<button
		onclick={() => {
			downloadWorld({
				assets: [],
				content: { edges: [], nodes: [] },
				id: '0-0-0-0-0',
				name: 'Test World',
				state: {},
				version: CURRENT_VERSION
			});
		}}>Download</button
	>
</div>
