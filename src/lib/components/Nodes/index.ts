import type { NodeTypes } from '@xyflow/svelte';

//-----------------------------------------------------------

import type { ScreenNode } from './Screen/type';

export type Nodes = ScreenNode;

//-----------------------------------------------------------

import Screen from './Screen/Screen.svelte';

export const nodes = {
	screen: Screen
} satisfies NodeTypes;
