import type { Edge, Node } from '@xyflow/svelte';

interface Position {
	x: number;
	y: number;
}

// Context Menu
interface PanelContextMenu {
	type: 'panel';
	position: Position;
}

interface NodeContextMenu {
	type: 'node';
	position: Position;
	node: Node;
}

interface EdgeContextMenu {
	type: 'edge';
	position: Position;
	edge: Edge;
}

interface SelectionContextMenu {
	type: 'selection';
}

type ContextMenu =
	| PanelContextMenu
	| NodeContextMenu
	| EdgeContextMenu
	| SelectionContextMenu
	| null;

// Sidebar
interface PanelSidebar {
	type: 'panel';
	position: Position;
}

interface NodeSidebar {
	type: 'node';
	position: Position;
	node: Node;
}

interface EdgeSidebar {
	type: 'edge';
	position: Position;
	edge: Edge;
}

interface SelectionSidebar {
	type: 'selection';
}

type Sidebar = PanelSidebar | NodeSidebar | EdgeSidebar | SelectionSidebar | null;

// Toolbar
interface Toolbar {
	type: 'selection' | 'pan';
}

class UIManager {
	ctxMenu = $state<ContextMenu>(null);
	sidebar = $state<Sidebar>(null);
	toolbar = $state<Toolbar>({ type: 'selection' });

	resetState = () => {
		this.ctxMenu = null;
		this.sidebar = null;
	};
}

export const uiManager = new UIManager();
