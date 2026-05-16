<script lang="ts">
  // ── Types ────────────────────────────────────────────────────
  export interface NodeData {
    title:   string;
    image:   string;
    content: string;
  }

  export interface FlowNode {
    id:   string;
    data: NodeData;
  }

  export interface SaveDetail {
    id:   string;
    data: NodeData;
  }

  interface Draft {
    title:   string;
    image:   string;
    content: string;
  }

  // ── Props ────────────────────────────────────────────────────
  interface Props {
    open?:    boolean;
    node?:    FlowNode | null;
    onsave?:  (detail: SaveDetail) => void;
    onclose?: () => void;
  }

  let {
    open    = false,
    node    = null,
    onsave  = undefined,
    onclose = undefined,
  }: Props = $props();

  // ── State ────────────────────────────────────────────────────
  let draft:     Draft                   = $state({ title: '', image: '', content: '' });
  let imgPreview: string                 = $state('');
  let dragging:   boolean                = $state(false);
  let fileInput:  HTMLInputElement | null = $state(null);

  let charCount: number = $derived(draft.content.length);

  $effect(() => {
    if (node) {
      draft      = { title: node.data.title ?? '', image: node.data.image ?? '', content: node.data.content ?? '' };
      imgPreview = node.data.image ?? '';
    }
  });

  // ── Emitters ─────────────────────────────────────────────────
  function emitSave(): void {
    if (!node) return;
    onsave?.({ id: node.id, data: { ...draft } });
  }

  function emitClose(): void {
    onclose?.();
  }

  // ── Keyboard ─────────────────────────────────────────────────
  function onKeydown(e: KeyboardEvent): void {
    if (!open) return;
    if (e.key === 'Escape') emitClose();
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') emitSave();
  }

  // ── Image helpers ────────────────────────────────────────────
  function readFile(file: File | null | undefined): void {
    if (!file?.type.startsWith('image/')) return;
    const r = new FileReader();
    r.onload = (e) => {
      const result = e.target?.result as string;
      imgPreview  = result;
      draft.image = result;
    };
    r.readAsDataURL(file);
  }

  function clearImage(): void {
    draft.image = '';
    imgPreview  = '';
    if (fileInput) fileInput.value = '';
  }

  function onDropZoneDrop(e: DragEvent): void {
    e.preventDefault();
    dragging = false;
    readFile(e.dataTransfer?.files[0]);
  }

  function onFileInputChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    readFile(input.files?.[0]);
  }
</script>

<svelte:window onkeydown={onKeydown} />

<!-- Backdrop -->
{#if open}
  <div class="fixed inset-0 z-40" role="presentation" onclick={emitClose}></div>
{/if}

<!--
  Canvas is bg-gray-900 with bg-gray-100 dots.
  Sidebar sits one step lighter than the canvas: bg-gray-800.
  Surfaces inside (inputs, drop zone) sit at bg-gray-900 — same as the canvas,
  which visually grounds them. Borders use gray-700.
-->
<aside
  class="fixed top-0 right-0 bottom-0 z-50 flex w-[360px] flex-col
         bg-gray-800 border-l border-gray-700
         transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
         will-change-transform"
  class:translate-x-full={!open}
  class:translate-x-0={open}
  aria-label="Node editor"
  aria-hidden={!open}
>

  <!-- Header -->
  <header class="flex items-center justify-between px-5 py-4 border-b border-gray-700 shrink-0">
    <div class="flex items-center gap-2 text-sm font-semibold text-gray-100 tracking-tight">
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true" class="text-violet-400">
        <path d="M7 1l1.5 4.5H13L9.5 8l1.5 4.5L7 10l-4 2.5L4.5 8 1 5.5h4.5z"
              stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
      </svg>
      Edit node
    </div>
    <button
      onclick={emitClose}
      aria-label="Close"
      class="flex items-center justify-center w-7 h-7 rounded-md border border-gray-600
             text-gray-400 hover:bg-gray-700 hover:text-gray-100 transition-colors"
    >
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    </button>
  </header>

  <!-- Body -->
  <div class="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700">

    <!-- Title -->
    <div class="flex flex-col gap-1.5">
      <label for="sb-title" class="text-[10.5px] font-bold uppercase tracking-widest text-gray-400">
        Title
      </label>
      <input
        id="sb-title"
        type="text"
        bind:value={draft.title}
        placeholder="Node title…"
        autocomplete="off"
        class="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2.5
               text-sm text-gray-100 placeholder:text-gray-600
               outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15
               transition-all"
      />
    </div>

    <!-- Image -->
    <div class="flex flex-col gap-1.5">
      <div class="flex items-center gap-2">
        <span class="text-[10.5px] font-bold uppercase tracking-widest text-gray-400">Image</span>
        <span class="text-[10px] text-gray-600">optional cover</span>
      </div>

      {#if imgPreview}
        <div class="relative rounded-lg overflow-hidden border border-gray-700">
          <img src={imgPreview} alt="Cover preview" class="w-full h-36 object-cover block" />
          <button
            onclick={clearImage}
            aria-label="Remove image"
            class="absolute top-2 right-2 flex items-center justify-center w-6 h-6
                   rounded-md bg-gray-900/80 text-gray-200 hover:bg-red-700/80 transition-colors"
          >
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      {:else}
        <div
          role="button"
          tabindex="0"
          aria-label="Upload image — click or drag and drop"
          onclick={() => fileInput?.click()}
          onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && fileInput?.click()}
          ondragover={(e: DragEvent) => { e.preventDefault(); dragging = true; }}
          ondragleave={() => dragging = false}
          ondrop={onDropZoneDrop}
          class="flex flex-col items-center justify-center gap-1.5 py-6 rounded-lg
                 border border-dashed text-center cursor-pointer transition-all bg-gray-900
                 {dragging
                   ? 'border-violet-500/50 bg-violet-500/5'
                   : 'border-gray-700 hover:border-violet-500/40 hover:bg-violet-500/5'}"
        >
          <svg
            width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"
            class="mb-0.5 transition-colors {dragging ? 'text-violet-400' : 'text-gray-600'}"
          >
            <path d="M12 4v12M7 9l5-5 5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 20h18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
          <p class="text-xs text-gray-400">
            Drop image or <span class="text-violet-400 underline underline-offset-2">browse</span>
          </p>
          <p class="text-[10.5px] text-gray-600">PNG · JPG · WebP</p>
        </div>
      {/if}

      <input
        bind:this={fileInput}
        type="file"
        accept="image/*"
        class="hidden"
        onchange={onFileInputChange}
      />
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-1.5 flex-1">
      <div class="flex items-center gap-2">
        <label for="sb-content" class="text-[10.5px] font-bold uppercase tracking-widest text-gray-400">
          Content
        </label>
        <span class="text-[10px] text-violet-400 border border-violet-500/25 bg-violet-500/10 rounded px-1.5 py-px">
          Rich text · soon
        </span>
      </div>
      <div class="relative flex flex-col flex-1">
        <textarea
          id="sb-content"
          bind:value={draft.content}
          placeholder="Start writing here…"
          spellcheck="true"
          class="flex-1 min-h-36 w-full rounded-lg bg-gray-900 border border-gray-700
                 px-3 py-2.5 pb-7 text-sm text-gray-100 placeholder:text-gray-600
                 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15
                 transition-all resize-y leading-relaxed font-serif"
        ></textarea>
        <span class="absolute bottom-2.5 right-3 text-[10px] text-gray-600 tabular-nums pointer-events-none">
          {charCount}
        </span>
      </div>
    </div>

  </div>

  <!-- Footer -->
  <footer class="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-gray-700 shrink-0">
    <span class="text-[10.5px] text-gray-600 tracking-wide">⌘ + ↵ to save</span>
    <div class="flex items-center gap-2">
      <button
        onclick={emitClose}
        class="px-4 py-1.5 rounded-lg text-xs text-gray-400 border border-gray-700
               hover:bg-gray-700 hover:text-gray-100 transition-colors"
      >
        Cancel
      </button>
      <button
        onclick={emitSave}
        class="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold
               text-white bg-violet-600 hover:bg-violet-500 active:scale-95 transition-all"
      >
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1.5 7.5L5.5 12 12.5 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Save
      </button>
    </div>
  </footer>

</aside>