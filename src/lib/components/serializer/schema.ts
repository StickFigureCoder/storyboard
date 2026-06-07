import type { Edge, Node } from '@xyflow/svelte';
import type { UUID } from 'crypto';
import type { State } from '../expression-enging/types';

type Version = `${number}.${number}.${number}`;

export interface Content {
	version: Version;
	id: UUID;
	name: string;
	nodes: Node[];
	edges: Edge[];
}

export interface Schema {
	version: Version;
	state: State;
	content: Content;
}
