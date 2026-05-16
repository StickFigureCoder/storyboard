<script lang="ts">
	import { builder } from '../state/builder.svelte';

	// State
	let open = $derived(!!builder.sidebarMode);
	let sidebarMode = $derived(builder.sidebarMode);

	let title = $state('');
	let image = $state<{ src: string; alt: string } | null>(null);
	let description = $state('');

	$effect(() => {
		if (!sidebarMode) return;

		if (sidebarMode.type === 'node') {
			title = sidebarMode.node.data.title;
			image = sidebarMode.node.data.image || null;
			description = sidebarMode.node.data.description;
		}
	});

	// File Upload
	let fileRef = $state<HTMLInputElement | null>(null);
	let dragging = $state(false);

	const onFileInputChange = () => {
		if (!fileRef) return;

		const file = fileRef.files?.[0];

		if (!file || !file.type.startsWith('image/')) return;

		const reader = new FileReader();

		reader.onload = (e) => {
			image = { alt: file.name, src: e.target?.result as string };
		};

		reader.readAsDataURL(file);
	};
	const onDropZoneDrop = console.log;

	// Funtions
	const onClose = () => {
		builder.sidebarMode = null;
	};
	const onClearImage = () => {
		image = null;
	};

	const onSave = () => {
		if (sidebarMode?.type === 'node') {
			const node = {
				...sidebarMode.node,
				data: {
					title,
					image,
					description
				}
			};

			builder.addUpdateNode(node);
			onClose();
		}
	};
</script>

<!-- Backdrop -->
{#if open}
	<div class="fixed inset-0 z-40" role="presentation" onclick={onClose}></div>
{/if}

<aside
	class="fixed top-0 right-0 bottom-0 z-50 flex w-[360px] flex-col border-l border-gray-700 bg-gray-800 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
	class:translate-x-full={!open}
	class:translate-x-0={open}
	aria-label="Node editor"
	aria-hidden={!open}
>
	<!-- Header -->
	<header class="flex shrink-0 items-center justify-between border-b border-gray-700 px-5 py-4">
		<div class="flex items-center gap-2 text-sm font-semibold tracking-tight text-gray-100">
			<svg
				width="13"
				height="13"
				viewBox="0 0 14 14"
				fill="none"
				aria-hidden="true"
				class="text-violet-400"
			>
				<path
					d="M7 1l1.5 4.5H13L9.5 8l1.5 4.5L7 10l-4 2.5L4.5 8 1 5.5h4.5z"
					stroke="currentColor"
					stroke-width="1.3"
					stroke-linejoin="round"
				/>
			</svg>
			Edit node
		</div>
		<button
			onclick={onClose}
			aria-label="Close"
			class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-600
             text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-100"
		>
			<svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
				<path
					d="M1 1l12 12M13 1L1 13"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
				/>
			</svg>
		</button>
	</header>

	<!-- Body -->
	<div
		class="flex flex-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent flex-col gap-5 overflow-y-auto px-5 py-5"
	>
		<!-- Title -->
		<div class="flex flex-col gap-1.5">
			<label for="sb-title" class="text-[10.5px] font-bold tracking-widest text-gray-400 uppercase">
				Title
			</label>
			<input
				id="sb-title"
				type="text"
				bind:value={title}
				placeholder="Node title…"
				autocomplete="off"
				class="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2.5
               text-sm text-gray-100 transition-all
               outline-none placeholder:text-gray-600 focus:border-violet-500/60 focus:ring-2
               focus:ring-violet-500/15"
			/>
		</div>

		<!-- Image -->
		<div class="flex flex-col gap-1.5">
			<div class="flex items-center gap-2">
				<span class="text-[10.5px] font-bold tracking-widest text-gray-400 uppercase">Image</span>
				<span class="text-[10px] text-gray-600">optional cover</span>
			</div>

			{#if image}
				<div class="relative overflow-hidden rounded-lg border border-gray-700">
					<img src={image.src} alt={image.alt} class="block h-36 w-full object-cover" />
					<button
						onclick={onClearImage}
						aria-label="Remove image"
						class="absolute top-2 right-2 flex h-6 w-6 items-center justify-center
                   rounded-md bg-gray-900/80 text-gray-200 transition-colors hover:bg-red-700/80"
					>
						<svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
							<path
								d="M1 1l12 12M13 1L1 13"
								stroke="currentColor"
								stroke-width="1.8"
								stroke-linecap="round"
							/>
						</svg>
					</button>
				</div>
			{:else}
				<button
					tabindex="0"
					aria-label="Upload image — click or drag and drop"
					onclick={() => {
						fileRef?.click();
					}}
					ondragover={(e: DragEvent) => {
						e.preventDefault();
						dragging = true;
					}}
					ondragleave={() => (dragging = false)}
					ondrop={onDropZoneDrop}
					class="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg
                 border border-dashed bg-gray-900 py-6 text-center transition-all
                 {dragging
						? 'border-violet-500/50 bg-violet-500/5'
						: 'border-gray-700 hover:border-violet-500/40 hover:bg-violet-500/5'}"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						aria-hidden="true"
						class="mb-0.5 transition-colors {dragging ? 'text-violet-400' : 'text-gray-600'}"
					>
						<path
							d="M12 4v12M7 9l5-5 5 5"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path d="M3 20h18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
					</svg>
					<p class="text-xs text-gray-400">
						Drop image or <span class="text-violet-400 underline underline-offset-2">browse</span>
					</p>
					<p class="text-[10.5px] text-gray-600">PNG · JPG · WebP</p>
				</button>
			{/if}

			<input
				bind:this={fileRef}
				type="file"
				accept="image/*"
				class="hidden"
				onchange={onFileInputChange}
			/>
		</div>

		<!-- Content -->
		<div class="flex flex-1 flex-col gap-1.5">
			<div class="flex items-center gap-2">
				<label
					for="sb-content"
					class="text-[10.5px] font-bold tracking-widest text-gray-400 uppercase"
				>
					Content
				</label>
				<span
					class="rounded border border-violet-500/25 bg-violet-500/10 px-1.5 py-px text-[10px] text-violet-400"
				>
					Rich text · soon
				</span>
			</div>
			<div class="relative flex flex-1 flex-col">
				<textarea
					id="sb-content"
					bind:value={description}
					placeholder="Start writing here…"
					spellcheck="true"
					class="min-h-36 w-full flex-1 resize-y rounded-lg border border-gray-700
                 bg-gray-900 px-3 py-2.5 pb-7 font-serif text-sm
                 leading-relaxed text-gray-100 transition-all outline-none
                 placeholder:text-gray-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15"
				></textarea>
				<span
					class="pointer-events-none absolute right-3 bottom-2.5 text-[10px] text-gray-600 tabular-nums"
				>
					{description.length}
				</span>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<footer
		class="flex shrink-0 items-center justify-between gap-3 border-t border-gray-700 px-5 py-3.5"
	>
		<span class="text-[10.5px] tracking-wide text-gray-600">⌘ + ↵ to save</span>
		<div class="flex items-center gap-2">
			<button
				onclick={onClose}
				class="rounded-lg border border-gray-700 px-4 py-1.5 text-xs text-gray-400
               transition-colors hover:bg-gray-700 hover:text-gray-100"
			>
				Cancel
			</button>
			<button
				onclick={onSave}
				class="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-1.5 text-xs
               font-semibold text-white transition-all hover:bg-violet-500 active:scale-95"
			>
				<svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
					<path
						d="M1.5 7.5L5.5 12 12.5 2"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				Save
			</button>
		</div>
	</footer>
</aside>
