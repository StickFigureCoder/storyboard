import type { Edge, Node } from '@xyflow/svelte';
import type { UUID } from 'crypto';
import type { State } from '../expression-engine/types';

export interface Content {
	nodes: Node[];
	edges: Edge[];
}

export interface WorldSchema {
	id: UUID;
	name: string;
	version: string;
	state: State;
	content: Content;
}
