import type { Node, NodeProps } from '@xyflow/svelte';

export interface ScreenNode extends Node {
	type: 'screen';
	data: ScreenData;
}

export interface ScreenProps extends NodeProps {
	type: 'screen';
	data: ScreenData;
}

export interface ScreenData extends Record<string, unknown> {
	image: {
		src: string;
		alt: string;
	} | null;
	title: string;
	description: string;
}
