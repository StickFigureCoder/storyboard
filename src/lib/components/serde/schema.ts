import type { Edge, Node } from '@xyflow/svelte';
import type { UUID } from 'crypto';
import type { State } from '../expression-enging/types';

type Version = `${number}.${number}.${number}`;

export interface Content {
	nodes: Node[];
	edges: Edge[];
}

export interface WorldSchema {
	id: UUID;
	name: string;
	version: Version;
	state: State;
	content: Content;
}

export const EXTENSION = 'storyboard';
export const WORLD_FILE = 'world.json';
