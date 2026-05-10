import type { Edge, Node } from '@xyflow/svelte';

export type ContextMenuMode =
	| NodeContextMenuMode
	| EdgeContextMenuMode
	| PanelContextMenuMode
	| SelectionContextMenuMode
	| null;

interface Position {
	x: number;
	y: number;
}

export interface BaseContextMenuMode {
	type: string;
}

export interface NodeContextMenuMode extends BaseContextMenuMode {
	type: 'node';
	pos: Position;
	node: Node;
}

export interface EdgeContextMenuMode extends BaseContextMenuMode {
	type: 'edge';
	pos: Position;
	node: Edge;
}

export interface PanelContextMenuMode extends BaseContextMenuMode {
	type: 'panel';
	pos: Position;
}

export interface SelectionContextMenuMode extends BaseContextMenuMode {
	type: 'selection';
	pos: Position;
}

export type ToolbarMode = SelectionToolbarMode | PanToolbarMode;

export interface BaseToolbarMode {
	type: string;
}

export interface SelectionToolbarMode extends BaseToolbarMode {
	type: 'selection';
}

export interface PanToolbarMode extends BaseToolbarMode {
	type: 'pan';
}

export type SidebarMode = NodeSidebarMode | EdgeSidebarMode | null;

export interface BaseSidebarMode {
	type: string;
}

export interface NodeSidebarMode extends BaseSidebarMode {
	type: 'node';
	node: Node;
}

export interface EdgeSidebarMode extends BaseSidebarMode {
	type: 'edge';
	edge: Edge;
}
