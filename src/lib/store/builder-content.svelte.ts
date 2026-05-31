import type { Edge, Node } from '@xyflow/svelte';

class ContentManager {
	nodes = $state.raw<Node[]>([]);
	edges = $state.raw<Edge[]>([]);
}

export const contentManager = new ContentManager();
