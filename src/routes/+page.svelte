<script lang="ts">
	import type { ContextMap, ExpressionValue } from '$lib/expression-engine/types';
	import { tokenize } from '$lib/expression-engine/lexer';
	import { parse } from '$lib/expression-engine/parser';
	import { evaluate } from '$lib/expression-engine/evaluator';

	// --- STATE ---
	type VariableDef = {
		id: string;
		name: string;
		type: 'number' | 'string' | 'boolean';
		value: ExpressionValue;
	};

	let variables = $state<VariableDef[]>([
		{ id: crypto.randomUUID(), name: 'player.gold', type: 'number', value: 15 },
		{ id: crypto.randomUUID(), name: 'inventory.hasSword', type: 'boolean', value: true },
		{ id: crypto.randomUUID(), name: 'player.class', type: 'string', value: 'warrior' }
	]);

	let expression = $state('player.gold >= 10 && inventory.hasSword == true');

	// --- DERIVED REACTIVITY ---
	let contextMap = $derived.by<ContextMap>(() => {
		const map: ContextMap = {};
		for (const v of variables) {
			if (v.name.trim() !== '') {
				map[v.name.trim()] = v.value;
			}
		}
		return map;
	});

	let evaluation = $derived.by(() => {
		if (!expression.trim()) return { success: true, result: '---' };

		try {
			const tokens = tokenize(expression);
			const ast = parse(tokens);
			const result = evaluate(ast, contextMap);

			return { success: true, result, ast };
		} catch (error: any) {
			return { success: false, error: error.message };
		}
	});

	// --- UI ACTIONS ---
	function addVariable() {
		variables.push({
			id: crypto.randomUUID(),
			name: `new_var_${variables.length}`,
			type: 'number',
			value: 0
		});
	}

	function removeVariable(id: string) {
		const index = variables.findIndex((v) => v.id === id);
		if (index !== -1) variables.splice(index, 1);
	}

	function handleTypeChange(v: VariableDef) {
		if (v.type === 'number') v.value = 0;
		if (v.type === 'string') v.value = '';
		if (v.type === 'boolean') v.value = false;
	}

	// Helper for Tailwind Badge Colors to prevent PurgeCSS issues
	function getBadgeColors(type: string) {
		switch (type) {
			case 'boolean':
				return 'bg-blue-100 text-blue-800';
			case 'number':
				return 'bg-yellow-200 text-yellow-800';
			case 'string':
				return 'bg-purple-200 text-purple-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<div
	class="mx-auto my-8 max-w-5xl rounded-lg border border-gray-200 bg-gray-50 p-6 font-sans text-gray-800 shadow-sm md:p-8"
>
	<header class="mb-6">
		<h2 class="m-0 mb-1 text-2xl font-bold text-gray-900">CYOA Expression Tester</h2>
		<p class="m-0 text-sm text-gray-500">Test your logic dynamically. Strict typing is enforced!</p>
	</header>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- LEFT COLUMN: Variables Builder -->
		<section class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="m-0 text-lg font-semibold">Variables State</h3>
				<button
					class="cursor-pointer rounded border-none bg-blue-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-600"
					onclick={addVariable}
				>
					+ Add Variable
				</button>
			</div>

			<div class="flex flex-col gap-3">
				{#each variables as v (v.id)}
					<div class="flex items-center gap-2">
						<!-- Variable Name -->
						<input
							type="text"
							class="flex-[2] rounded border border-gray-300 px-2.5 py-1.5 text-sm transition-shadow focus:ring-2 focus:ring-blue-500 focus:outline-none"
							bind:value={v.name}
							placeholder="Variable Name"
						/>

						<!-- Variable Type Selector -->
						<select
							class="flex-1 rounded border border-gray-300 bg-white px-2.5 py-1.5 text-sm transition-shadow focus:ring-2 focus:ring-blue-500 focus:outline-none"
							bind:value={v.type}
							onchange={() => handleTypeChange(v)}
						>
							<option value="number">Number</option>
							<option value="string">String</option>
							<option value="boolean">Boolean</option>
						</select>

						<!-- Dynamic Value Input -->
						{#if v.type === 'number'}
							<input
								type="number"
								class="min-w-[60px] flex-1 rounded border border-gray-300 px-2.5 py-1.5 text-sm transition-shadow focus:ring-2 focus:ring-blue-500 focus:outline-none"
								bind:value={v.value as number}
							/>
						{:else if v.type === 'string'}
							<input
								type="text"
								class="min-w-[60px] flex-1 rounded border border-gray-300 px-2.5 py-1.5 text-sm transition-shadow focus:ring-2 focus:ring-blue-500 focus:outline-none"
								bind:value={v.value as string}
							/>
						{:else if v.type === 'boolean'}
							<input
								type="checkbox"
								class="mx-4 h-5 w-5 cursor-pointer accent-blue-600"
								bind:checked={v.value as boolean}
							/>
						{/if}

						<button
							class="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded border-none bg-red-50 font-bold text-red-500 transition-colors hover:bg-red-100"
							aria-label="Remove"
							onclick={() => removeVariable(v.id)}
						>
							✕
						</button>
					</div>
				{/each}

				{#if variables.length === 0}
					<p class="m-0 py-2 text-sm text-gray-400 italic">No variables defined.</p>
				{/if}
			</div>
		</section>

		<!-- RIGHT COLUMN: Expression & Output -->
		<section class="flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
			<h3 class="m-0 mb-3 text-lg font-semibold">Expression</h3>
			<textarea
				class="mb-5 h-24 w-full resize-y rounded border border-gray-300 p-3 font-mono text-sm transition-shadow focus:ring-2 focus:ring-blue-500 focus:outline-none md:text-base"
				bind:value={expression}
				placeholder="e.g. player.health > 0"
			></textarea>

			<h3 class="m-0 mb-3 text-lg font-semibold">Output</h3>

			<div
				class="flex min-h-[60px] items-center gap-3 rounded-md border p-4 transition-colors"
				class:bg-green-50={evaluation.success}
				class:border-green-200={evaluation.success}
				class:text-green-800={evaluation.success}
				class:bg-red-50={!evaluation.success}
				class:border-red-200={!evaluation.success}
				class:text-red-800={!evaluation.success}
			>
				{#if evaluation.success}
					<span
						class="rounded-full px-2.5 py-1 text-xs font-bold tracking-wide uppercase {getBadgeColors(
							typeof evaluation.result
						)}"
					>
						{typeof evaluation.result}
					</span>
					<strong class="font-mono text-xl break-all">{evaluation.result}</strong>
				{:else}
					<strong class="text-sm">❌ {evaluation.error}</strong>
				{/if}
			</div>

			<!-- Optional: AST Debugger -->
			<details class="group mt-6 text-sm">
				<summary
					class="cursor-pointer font-medium text-gray-500 outline-none select-none hover:text-gray-700"
				>
					<span class="border-b border-dashed border-gray-400">View Parsed AST (Debug)</span>
				</summary>
				{#if evaluation.success && evaluation.ast}
					<pre
						class="mt-3 overflow-x-auto rounded-md bg-gray-800 p-4 font-mono text-xs text-gray-100 shadow-inner">{JSON.stringify(
							evaluation.ast,
							null,
							2
						)}</pre>
				{:else}
					<p class="mt-3 text-gray-500 italic">No valid AST available due to errors.</p>
				{/if}
			</details>
		</section>
	</div>
</div>
