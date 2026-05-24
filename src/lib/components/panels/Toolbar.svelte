<script lang="ts">
	import {
		Hand,
		MousePointer2,
		ZoomIn,
		ZoomOut,
		Maximize2,
		Undo2,
		Redo2,
		Lock,
		LockOpen,
		Trash2,
		Copy,
		Scissors
	} from '@lucide/svelte';
	import type { Component } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { builder } from '../../store/builder.svelte';
	import { useSvelteFlow } from '@xyflow/svelte';

	type LucideIcon = Component<{ size?: number; strokeWidth?: number }>;

	const { fitView } = useSvelteFlow();

	let activeTool = $derived(builder.toolbarMode.type);
	let locked = false;
	let onToolChange = (tool: 'selection' | 'pan') => {
		builder.toolbarMode.type = tool;
	};
	let onZoomIn = () => {};
	let onZoomOut = () => {};
	let onFitView = () => { fitView({ padding: 0.1, duration: 700 }) };
	let onUndo = () => {};
	let onRedo = () => {};
	let onLockToggle = () => {};
	let onCopy = () => {};
	let onCut = () => {};
	let onDelete = () => {};

	let tooltip = $state('');
	let tooltipVisible = $state(false);

	function show(label: string): void {
		tooltip = label;
		tooltipVisible = true;
	}
	function hide(): void {
		tooltipVisible = false;
	}

	// ── Raw CSS values Tailwind can't express ──────────────────
	const dockStyle = [
		'background:rgba(16,22,36,0.72)',
		'backdrop-filter:blur(20px) saturate(1.6)',
		'-webkit-backdrop-filter:blur(20px) saturate(1.6)',
		'box-shadow:0 0 0 1px rgba(0,0,0,.4),0 8px 32px rgba(0,0,0,.55),0 2px 8px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.06)'
	].join(';');

	const tooltipStyle = [
		'bottom:calc(100% + 10px)',
		'transform:translateX(-50%)',
		'background:rgba(15,20,30,0.92)',
		'box-shadow:0 4px 12px rgba(0,0,0,.5)',
		'animation:tip-in 100ms ease forwards'
	].join(';');

	const activeInlineStyle = [
		'background:rgba(99,179,237,0.15)',
		'box-shadow:0 0 0 1px rgba(99,179,237,.25),inset 0 1px 0 rgba(144,205,244,.08)'
	].join(';');
</script>

<!-- keyframe for tooltip -->
<svelte:head>
	<style>
		@keyframes tip-in {
			from {
				opacity: 0;
				transform: translateX(-50%) translateY(3px);
			}
			to {
				opacity: 1;
				transform: translateX(-50%) translateY(0);
			}
		}
	</style>
</svelte:head>

<!-- ── Snippets ─────────────────────────────────────────────── -->

{#snippet btn(Icon: LucideIcon, label: string, tip: string, handler: () => void, active = false)}
	<button
		style={active ? activeInlineStyle : ''}
		class={cn(
			'relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent transition-[background,color,transform] duration-120 ease-out outline-none active:scale-[0.91]',
			active
				? 'text-sky-300 hover:text-sky-200'
				: 'text-gray-100/50 hover:bg-white/[0.07] hover:text-gray-100/95 active:bg-white/10'
		)}
		aria-label={label}
		onclick={handler}
		onmouseenter={() => show(tip)}
		onmouseleave={hide}
	>
		<Icon size={15} strokeWidth={1.75} />
	</button>
{/snippet}

{#snippet dangerBtn(Icon: LucideIcon, label: string, tip: string, handler: () => void)}
	<button
		class={cn(
			'relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent transition-[background,color,transform] duration-120 ease-out outline-none active:scale-[0.91]',
			'text-gray-100/50 hover:text-orange-400'
		)}
		aria-label={label}
		onclick={handler}
		onmouseenter={(e) => {
			(e.currentTarget as HTMLButtonElement).style.background = 'rgba(252,129,74,0.12)';
			show(tip);
		}}
		onmouseleave={(e) => {
			(e.currentTarget as HTMLButtonElement).style.background = '';
			hide();
		}}
		onmousedown={(e) => {
			(e.currentTarget as HTMLButtonElement).style.background = 'rgba(252,129,74,0.20)';
		}}
		onmouseup={(e) => {
			(e.currentTarget as HTMLButtonElement).style.background = 'rgba(252,129,74,0.12)';
		}}
	>
		<Icon size={15} strokeWidth={1.75} />
	</button>
{/snippet}

{#snippet divider()}
	<div class="mx-1 h-5 w-px shrink-0 bg-white/8"></div>
{/snippet}

<!-- ── Toolbar ───────────────────────────────────────────────── -->
<div
	role="toolbar"
	aria-label="Canvas toolbar"
	style={dockStyle}
	class="fixed bottom-7 left-1/2 z-50 flex -translate-x-1/2 items-center gap-0.5 rounded-[14px] border border-white/[0.07] px-1.5 py-1.5 select-none"
>
	<!-- Tools -->
	<div class="flex items-center gap-px">
		{@render btn(
			MousePointer2,
			'Select tool',
			'Select  V',
			() => onToolChange('selection'),
			activeTool === 'selection'
		)}
		{@render btn(Hand, 'Pan tool', 'Pan  H', () => onToolChange('pan'), activeTool === 'pan')}
	</div>

	{@render divider()}

	<!-- Edit -->
	<div class="flex items-center gap-px">
		{@render btn(Scissors, 'Cut', 'Cut  ⌘X', onCut)}
		{@render btn(Copy, 'Copy', 'Copy  ⌘C', onCopy)}
		{@render btn(Undo2, 'Undo', 'Undo  ⌘Z', onUndo)}
		{@render btn(Redo2, 'Redo', 'Redo  ⌘⇧Z', onRedo)}
		{@render dangerBtn(Trash2, 'Delete selected', 'Delete  ⌫', onDelete)}
	</div>

	{@render divider()}

	<!-- View -->
	<div class="flex items-center gap-px">
		{@render btn(ZoomIn, 'Zoom in', 'Zoom In  +', onZoomIn)}
		{@render btn(ZoomOut, 'Zoom out', 'Zoom Out  −', onZoomOut)}
		{@render btn(Maximize2, 'Fit view', 'Fit View  ⇧1', onFitView)}
	</div>

	{@render divider()}

	<!-- Lock -->
	<div class="flex items-center gap-px">
		{@render btn(
			locked ? Lock : LockOpen,
			locked ? 'Unlock canvas' : 'Lock canvas',
			locked ? 'Unlock Canvas' : 'Lock Canvas',
			onLockToggle,
			locked
		)}
	</div>

	<!-- Tooltip -->
	{#if tooltipVisible && tooltip}
		<div
			style={tooltipStyle}
			class="pointer-events-none absolute left-1/2 rounded-md border border-white/10 px-2.5 py-[5px] font-mono text-[11px] tracking-wide whitespace-nowrap text-gray-100/85"
		>
			{tooltip}
		</div>
	{/if}
</div>
