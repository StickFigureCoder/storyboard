<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	// Logic remains untouched as requested
	type CreateVar = {
		at: 'root' | 'section';
		section_index?: number;
		name: string;
		value?: App.Variable;
	};
	type RemoveVar = { at: 'root' | 'section'; section_index?: number; name: string };
	type Action = 'visible' | 'enabled' | 'target';
	type CreateAction = {
		at: 'section' | 'option';
		section_index: number;
		option_index?: number;
		action: Action;
		value?: App.RelationalOperator | string;
	};
	type RemoveAction = {
		at: 'section' | 'option';
		section_index: number;
		option_index?: number;
		action: Action;
		action_index?: number;
	};

	let graph = $state<App.Project>({
		id: 'root',
		name: 'Project',
		version: '0.0.1',
		variables: {},
		sections: []
	});
	let counter = $state(0);

	const createSection = (value?: App.Section) => {
		counter += 1;
		if (value) {
			graph.sections.push(value);
			return;
		}
		graph.sections.push({
			id: 'section_' + counter,
			name: '',
			variables: {},
			visible: [],
			enabled: [],
			options: [],
			subsections: [],
			target: ''
		});
	};
	const removeSection = (section_index: number) => {
		graph.sections.splice(section_index, 1);
	};
	const createOption = (section_index: number, value?: App.Option) => {
		counter += 1;
		if (value) {
			graph.sections[section_index].options.push(value);
			return;
		}
		graph.sections[section_index].options.push({
			id: 'option_' + counter,
			name: '',
			visible: [],
			enabled: [],
			set: [],
			target: ''
		});
	};
	const removeOption = (section_index: number, option_index: number) => {
		graph.sections[section_index].options.splice(option_index, 1);
	};
	const createVariable = (query: CreateVar) => {
		if (query.at === 'root') {
			if (query.value) {
				graph.variables[query.name] = query.value;
				return;
			}
			graph.variables[query.name] = { type: 'number', current: 0 };
		}
		if (query.at === 'section' && typeof query.section_index === 'number') {
			if (query.value) {
				graph.sections[query.section_index].variables[query.name] = query.value;
				return;
			}
			graph.sections[query.section_index].variables[query.name] = { type: 'number', current: 0 };
		}
	};
	const removeVariable = (query: RemoveVar) => {
		if (query.at === 'root') {
			delete graph.variables[query.name];
		}
		if (query.at === 'section' && typeof query.section_index === 'number') {
			delete graph.sections[query.section_index].variables[query.name];
		}
	};
	const createActionConstraint = (query: CreateAction) => {
		if (query.at === 'section') {
			if (query.value) {
				if (query.action === 'target' && typeof query.value === 'string') {
					graph.sections[query.section_index][query.action] = query.value;
				}
				if (query.action !== 'target' && typeof query.value !== 'string') {
					graph.sections[query.section_index][query.action].push(query.value);
				}
				return;
			}
			if (query.action === 'target') {
				graph.sections[query.section_index][query.action] = '';
			}
			if (query.action !== 'target') {
				graph.sections[query.section_index][query.action].push(['', '==', 0]);
			}
		}
		if (query.at === 'option' && typeof query.option_index === 'number') {
			if (query.value) {
				if (query.action === 'target' && typeof query.value === 'string') {
					graph.sections[query.section_index].options[query.option_index][query.action] =
						query.value;
				}
				if (query.action !== 'target' && typeof query.value !== 'string') {
					graph.sections[query.section_index].options[query.option_index][query.action].push(
						query.value
					);
				}
				return;
			}
			if (query.action === 'target') {
				graph.sections[query.section_index].options[query.option_index][query.action] = '';
			}
			if (query.action !== 'target') {
				graph.sections[query.section_index].options[query.option_index][query.action].push([
					'',
					'==',
					0
				]);
			}
		}
	};
	const removeActionConstraint = (query: RemoveAction) => {
		if (query.at === 'section') {
			if (query.action === 'target') {
				graph.sections[query.section_index][query.action] = '';
			}
			if (query.action !== 'target') {
				graph.sections[query.section_index][query.action] = [];
			}
		}
		if (query.at === 'option' && typeof query.option_index === 'number') {
			if (query.action === 'target') {
				graph.sections[query.section_index].options[query.option_index][query.action] = '';
			}
			if (query.action !== 'target' && typeof query.action_index === 'number') {
				graph.sections[query.section_index].options[query.option_index][query.action].splice(
					query.action_index,
					1
				);
			}
		}
	};

	// eslint-disable-next-line svelte/no-inspect
	$inspect(graph);
</script>

<main class="min-h-screen bg-zinc-950 p-8 font-sans text-zinc-200">
	<div class="mx-auto max-w-5xl space-y-8">
		<!-- Header / Root Actions -->
		<header class="flex items-center justify-between border-b border-zinc-800 pb-6">
			<div>
				<h1 class="text-2xl font-bold tracking-tight text-white">{graph.name}</h1>
				<p class="text-sm text-zinc-500">v{graph.version} • {graph.id}</p>
			</div>
			<div class="flex gap-3">
				<button
					class="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium transition hover:bg-zinc-700 active:scale-95"
					onclick={() => {
						counter += 1;
						createVariable({ at: 'root', name: 'var_' + counter });
					}}
				>
					<span class="text-blue-400">+</span> Add Root Variable
				</button>
				<button
					class="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 active:scale-95"
					onclick={() => createSection()}
				>
					<span>+</span> Create Section
				</button>
			</div>
		</header>

		<!-- Root Variables -->
		{#if Object.keys(graph.variables).length > 0}
			<section class="space-y-3" transition:fade>
				<h2 class="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
					Root Variables
				</h2>
				<div class="flex flex-wrap gap-2">
					{#each Object.keys(graph.variables) as variable_key (variable_key)}
						<button
							class="group flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/50 py-1 pr-2 pl-3 text-xs transition hover:border-red-500/50 hover:bg-red-500/10"
							onclick={() => removeVariable({ at: 'root', name: variable_key })}
						>
							<span>{variable_key}</span>
							<span class="text-zinc-600 group-hover:text-red-500">✕</span>
						</button>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Sections List -->
		<div class="grid gap-6">
			{#each graph.sections as section, section_index (section.id)}
				<div
					class="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl transition-all hover:border-zinc-700"
					transition:slide
				>
					<!-- Section Header -->
					<div class="flex items-center justify-between bg-zinc-800/50 px-5 py-3">
						<div class="flex items-center gap-3">
							<div
								class="flex h-8 w-8 items-center justify-center rounded bg-indigo-500/20 font-mono text-xs text-indigo-400"
							>
								{section_index + 1}
							</div>
							<h3 class="font-medium text-zinc-100">{section.id}</h3>
						</div>
						<button
							class="text-xs text-zinc-500 transition hover:text-red-400"
							onclick={() => removeSection(section_index)}
						>
							Delete Section
						</button>
					</div>

					<div class="space-y-6 p-5">
						<!-- Section Variables -->
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<h4 class="text-xs font-medium text-zinc-400 uppercase">Variables</h4>
								<button
									class="rounded bg-zinc-800 px-2 py-1 text-[10px] transition hover:bg-zinc-700"
									onclick={() => {
										counter += 1;
										createVariable({ at: 'section', section_index, name: 'var_' + counter });
									}}>+ Add</button
								>
							</div>
							<div class="flex flex-wrap gap-2">
								{#each Object.keys(section.variables) as variable_key (variable_key)}
									<button
										class="flex items-center gap-2 rounded border border-zinc-700 px-2 py-1 text-[11px] transition hover:border-red-900 hover:bg-red-950/30"
										onclick={() =>
											removeVariable({ at: 'section', section_index, name: variable_key })}
									>
										{variable_key} <span class="opacity-50">×</span>
									</button>
								{/each}
								{#if Object.keys(section.variables).length === 0}
									<p class="text-[11px] font-light text-zinc-600 italic">No local variables</p>
								{/if}
							</div>
						</div>

						<!-- Section Options -->
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<h4 class="text-xs font-medium tracking-wider text-zinc-400 uppercase">Options</h4>
								<button
									class="rounded border border-indigo-500/20 bg-indigo-900/30 px-2 py-1 text-[10px] text-indigo-300 transition hover:bg-indigo-900/50"
									onclick={() => createOption(section_index)}>+ Create Option</button
								>
							</div>

							<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
								{#each section.options as option, option_index (option.id)}
									<div
										class="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 transition hover:border-zinc-700"
									>
										<div class="mb-3 flex items-center justify-between">
											<span class="text-xs font-bold text-zinc-300">{option.id}</span>
											<button
												onclick={() => removeOption(section_index, option_index)}
												aria-label="Remove Option"
												class="text-zinc-600 hover:text-red-500"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="14"
													height="14"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
													><path d="M3 6h18" /><path
														d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
													/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg
												>
											</button>
										</div>

										<button
											class="w-full rounded bg-zinc-800 py-2 text-[10px] font-semibold tracking-tight text-zinc-400 uppercase transition hover:bg-zinc-700 hover:text-white"
											onclick={() => {
												counter += 1;
												if (option.target) {
													removeActionConstraint({
														at: 'option',
														action: 'target',
														section_index,
														option_index
													});
												} else {
													createActionConstraint({
														at: 'option',
														action: 'target',
														value: 'target_' + counter,
														section_index,
														option_index
													});
												}
											}}
										>
											{#if option.target}
												Target: <span class="text-blue-400">{option.target}</span>
											{:else}
												Set Target
											{/if}
										</button>
										<button
											class="w-full rounded bg-zinc-800 py-2 text-[10px] font-semibold tracking-tight text-zinc-400 uppercase transition hover:bg-zinc-700 hover:text-white"
											onclick={() => {
												counter += 1;
												if (option.target) {
													removeActionConstraint({
														at: 'option',
														action: 'enabled',
														section_index,
														option_index,
														action_index: 0
													});
												} else {
													createActionConstraint({
														at: 'option',
														action: 'enabled',
														section_index,
														option_index
													});
												}
											}}
										>
											{#if option.enabled.length > 0}
												Enabled: <span class="text-blue-400">{option.enabled}</span>
											{:else}
												Set Enabled
											{/if}
										</button>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{/each}

			{#if graph.sections.length === 0}
				<div
					class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-800 py-20 text-zinc-500"
				>
					<p>No sections created yet.</p>
					<button
						onclick={() => createSection()}
						class="mt-4 text-sm text-indigo-400 hover:underline"
					>
						Add your first section
					</button>
				</div>
			{/if}
		</div>
	</div>
</main>

<style>
	:global(body) {
		background-color: #09090b;
	}
</style>
