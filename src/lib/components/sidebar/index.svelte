<script lang="ts">
	import { Panel } from '@xyflow/svelte';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger
	} from '$lib/components/ui/accordion';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Switch } from '$lib/components/ui/switch';
	import { ImagePlus, Trash2, Plus, Save, Monitor } from '@lucide/svelte';

	type DisplayMode = 'hero' | 'behind' | 'split';
	type OptionType = 'card' | 'row';

	type ScreenImage = {
		id: string;
		url: string;
		displayMode: DisplayMode;
	};

	type ScreenOption = {
		id: string;
		label: string;
		type: OptionType;
		multiselect: boolean;
	};

	type ScreenNode = {
		id: string;
		title: string;
		content: string;
		background: { images: ScreenImage[] };
		options: ScreenOption[];
	};

	let node: ScreenNode = {
		id: '',
		background: { images: [] },
		content: '',
		options: [],
		title: ''
	};

	let draft = $derived(node ? structuredClone(node) : null);

	// Derived label for each option's select trigger
	const optionTypes: { value: OptionType; label: string }[] = [
		{ value: 'card', label: 'Card' },
		{ value: 'row', label: 'Row' }
	];

	function getOptionTypeLabel(type: OptionType) {
		return optionTypes.find((t) => t.value === type)?.label ?? 'Select type...';
	}

	function addImage() {
		if (!draft) return;
		draft.background.images.push({ id: crypto.randomUUID(), url: '', displayMode: 'hero' });
	}

	function removeImage(id: string) {
		if (!draft) return;
		draft.background.images = draft.background.images.filter((img) => img.id !== id);
	}

	function setDisplayMode(img: ScreenImage, mode: DisplayMode) {
		img.displayMode = mode;
	}

	function addOption() {
		if (!draft) return;
		draft.options.push({ id: crypto.randomUUID(), label: '', type: 'card', multiselect: false });
	}

	function removeOption(id: string) {
		if (!draft) return;
		draft.options = draft.options.filter((o) => o.id !== id);
	}

	function handleSave() {
		console.log('saving', draft);
	}
</script>

{#if draft}
	<Panel position="center-right">
		<div
			class="flex h-[640px] w-80 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
		>
			<!-- Header -->
			<div class="flex items-center justify-between bg-muted/40 px-4 py-3">
				<div class="flex items-center gap-2">
					<div class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
						<Monitor class="h-4 w-4 text-primary" />
					</div>
					<div>
						<p class="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
							Screen
						</p>
						<p class="max-w-[160px] truncate text-sm leading-tight font-semibold">
							{draft.title || 'Untitled'}
						</p>
					</div>
				</div>
				<Button size="sm" class="h-8 gap-1.5 text-xs" onclick={handleSave}>
					<Save class="h-3.5 w-3.5" />
					Save
				</Button>
			</div>

			<Separator />

			<!-- Tabs -->
			<Tabs value="content" class="flex flex-1 flex-col overflow-hidden">
				<TabsList class="mx-3 mt-3 mb-1 grid h-9 grid-cols-3">
					<TabsTrigger value="content" class="text-xs">Content</TabsTrigger>
					<TabsTrigger value="background" class="text-xs">Background</TabsTrigger>
					<TabsTrigger value="options" class="gap-1 text-xs">
						Options
						{#if draft.options?.length}
							<Badge variant="secondary" class="h-4 px-1 text-[10px]">{draft.options.length}</Badge>
						{/if}
					</TabsTrigger>
				</TabsList>

				<ScrollArea class="flex-1 px-3">
					<!-- ── CONTENT ── -->
					<TabsContent value="content" class="mt-0 space-y-4 py-3">
						<div class="space-y-1.5">
							<Label class="text-xs text-muted-foreground">Title</Label>
							<Input bind:value={draft.title} placeholder="Screen title..." class="h-8 text-sm" />
						</div>

						<div class="space-y-1.5">
							<Label class="text-xs text-muted-foreground">Main Content</Label>
							<div
								class="flex min-h-[140px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/30"
							>
								<!-- <TiptapEditor bind:content={draft.content} /> -->
								<p class="text-xs text-muted-foreground">Rich text editor</p>
							</div>
						</div>
					</TabsContent>

					<!-- ── BACKGROUND ── -->
					<TabsContent value="background" class="mt-0 space-y-3 py-3">
						{#if draft.background.images.length === 0}
							<div
								class="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 py-8"
							>
								<ImagePlus class="h-6 w-6 text-muted-foreground" />
								<p class="text-xs text-muted-foreground">No images yet</p>
							</div>
						{/if}

						<Accordion type="multiple" class="space-y-2">
							{#each draft.background.images as img (img.id)}
								<AccordionItem
									value={img.id}
									class="overflow-hidden rounded-xl border border-border px-3"
								>
									<AccordionTrigger class="py-2.5 text-xs hover:no-underline">
										<span class="flex items-center gap-2">
											{#if img.url}
												<img src={img.url} alt="" class="h-6 w-6 rounded object-cover" />
											{:else}
												<div class="flex h-6 w-6 items-center justify-center rounded bg-muted">
													<ImagePlus class="h-3 w-3 text-muted-foreground" />
												</div>
											{/if}
											Image
										</span>
									</AccordionTrigger>
									<AccordionContent class="space-y-3 pb-3">
										<!-- Preview + upload -->
										<div class="relative h-24 overflow-hidden rounded-lg bg-muted">
											{#if img.url}
												<img src={img.url} alt="bg" class="h-full w-full object-cover" />
											{:else}
												<div class="flex h-full w-full items-center justify-center">
													<ImagePlus class="h-5 w-5 text-muted-foreground" />
												</div>
											{/if}
											<Button
												variant="secondary"
												size="sm"
												class="absolute right-2 bottom-2 h-6 px-2 text-[10px]"
											>
												Upload
											</Button>
										</div>

										<!-- Display mode -->
										<div class="space-y-1.5">
											<Label class="text-xs text-muted-foreground">Display Mode</Label>
											<div class="grid grid-cols-3 gap-1">
												{#each ['hero', 'behind', 'split'] as const as mode (mode)}
													<button
														onclick={() => setDisplayMode(img, mode)}
														class="rounded-lg border py-1.5 text-[11px] capitalize transition-all
                              {img.displayMode === mode
															? 'border-primary bg-primary/10 font-medium text-primary'
															: 'border-border bg-background text-muted-foreground hover:border-muted-foreground'}"
													>
														{mode}
													</button>
												{/each}
											</div>
										</div>

										<Button
											variant="ghost"
											size="sm"
											class="h-7 w-full gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
											onclick={() => removeImage(img.id)}
										>
											<Trash2 class="h-3 w-3" /> Remove Image
										</Button>
									</AccordionContent>
								</AccordionItem>
							{/each}
						</Accordion>

						<Button
							variant="outline"
							size="sm"
							class="h-8 w-full gap-1.5 border-dashed text-xs"
							onclick={addImage}
						>
							<Plus class="h-3.5 w-3.5" /> Add Image
						</Button>
					</TabsContent>

					<!-- ── OPTIONS ── -->
					<TabsContent value="options" class="mt-0 space-y-3 py-3">
						{#if draft.options.length === 0}
							<div
								class="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 py-8"
							>
								<p class="text-xs text-muted-foreground">No options yet</p>
							</div>
						{/if}

						{#each draft.options as option (option.id)}
							<div class="space-y-3 rounded-xl border border-border bg-muted/20 p-3">
								<div class="flex items-center justify-between">
									<span class="text-xs font-medium text-muted-foreground">
										{option.label || 'Untitled option'}
									</span>
									<Button
										variant="ghost"
										size="icon"
										class="h-6 w-6 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
										onclick={() => removeOption(option.id)}
									>
										<Trash2 class="h-3 w-3" />
									</Button>
								</div>

								<div class="space-y-1.5">
									<Label class="text-xs text-muted-foreground">Label</Label>
									<Input
										bind:value={option.label}
										placeholder="Option text..."
										class="h-8 text-sm"
									/>
								</div>

								<!-- ✅ Latest shadcn-svelte Select: namespace import, type="single", bind:value -->
								<div class="space-y-1.5">
									<Label class="text-xs text-muted-foreground">Type</Label>
									<Select.Root type="single" bind:value={option.type}>
										<Select.Trigger class="h-8 w-full text-sm">
											{getOptionTypeLabel(option.type)}
										</Select.Trigger>
										<Select.Content>
											{#each optionTypes as t (t.value)}
												<Select.Item value={t.value} label={t.label}>{t.label}</Select.Item>
											{/each}
										</Select.Content>
									</Select.Root>
								</div>

								<div class="flex items-center justify-between">
									<Label class="text-xs text-muted-foreground">Allow multiple</Label>
									<Switch bind:checked={option.multiselect} />
								</div>
							</div>
						{/each}

						<Button
							variant="outline"
							size="sm"
							class="h-8 w-full gap-1.5 border-dashed text-xs"
							onclick={addOption}
						>
							<Plus class="h-3.5 w-3.5" /> Add Option
						</Button>
					</TabsContent>
				</ScrollArea>
			</Tabs>
		</div>
	</Panel>
{/if}
