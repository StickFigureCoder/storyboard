<script>
	import { resolve } from '$app/paths';
</script>

<div class="flex h-screen w-screen items-center justify-center gap-4">
	<a class="font-bold underline hover:font-light" href={resolve('/builder')}>Builder</a>
	<p>or</p>
	<a class="font-bold underline hover:font-light" href={resolve('/player')}>Player</a>
</div>
