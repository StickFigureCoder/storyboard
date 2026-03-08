<script lang="ts">
	import type {
		CreateAction,
		CreateVar,
		Option,
		Project,
		RemoveAction,
		RemoveVar,
		Section
	} from '$lib/core/builder';
	import { slide, fade } from 'svelte/transition';

	let graph = $state<Project>({
		id: 'root',
		name: 'New Project',
		version: '0.0.1',
		variables: {},
		sections: []
	});
	let counter = $state(0);

	const createSection = (value?: Section) => {
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
	const createOption = (section_index: number, value?: Option) => {
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
				graph.sections[query.section_index][query.action] = [];
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
				graph.sections[query.section_index].options[query.option_index][query.action] = [];
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
</script>
