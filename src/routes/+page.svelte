<script>
	import { resolve } from '$app/paths';
</script>

<div class="flex h-screen w-screen items-center justify-center gap-4">
	<a class="font-light underline duration-300 hover:font-bold" href={resolve('/builder')}>Builder</a
	>
	<p>or</p>
	<a class="font-light underline duration-300 hover:font-bold" href={resolve('/player')}>Player</a>
</div>
