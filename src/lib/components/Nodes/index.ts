import type { NodeProps, NodeTypes } from '@xyflow/svelte';

import Screen from './Screen/Screen.svelte';
import type { ScreenNode } from './Screen/type';

export interface CustomNodeProps<T extends Record<string, unknown>> extends NodeProps {
	data: T;
}

export const nodeTypes = {
	screen: Screen
} satisfies NodeTypes;


type CustomNodes = ScreenNode;
export interface CustomeNodeType<T = CustomNodes> extends Node {
  data: T
};