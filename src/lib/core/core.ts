import type { Project } from './types';

export const createProject = (name: string): Project => {
	return {
		id: 'root',
		name,
		variables: {},
		nodes: []
	};
};
