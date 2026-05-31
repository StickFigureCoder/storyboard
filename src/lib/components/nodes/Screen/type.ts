import type { Node, NodeProps } from '@xyflow/svelte';

export interface Screen extends Node {
	data: Data;
}

export interface Props extends NodeProps {
	data: Data;
}

export interface Data extends Record<string, unknown> {
	title: string;
	image: string;
	content: string;
}
