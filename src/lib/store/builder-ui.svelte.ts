import type { Edge, Node } from '@xyflow/svelte';

interface Position {
	x: number;
	y: number;
}

// Toolbar
interface Toolbar {
	type: 'selection' | 'pan';
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
	position: Position;
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

class UIManager {
	ctxMenu = $state<ContextMenu>(null);
	sidebar = $state<Sidebar>(null);
	toolbar = $state<Toolbar>({ type: 'selection' });

	resetState = () => {
		this.ctxMenu = null;
		this.sidebar = null;
	};

	onPanelContextMenu = ({ event }: { event: MouseEvent }) => {		
		event.preventDefault();
		this.resetState();
		this.ctxMenu = { type: 'panel', position: { x: event.clientX, y: event.clientY } };
	};

	onNodeContextMenu = ({ event, node }: { event: MouseEvent; node: Node }) => {
		event.preventDefault();
		this.resetState();
		this.ctxMenu = { type: 'node', position: { x: event.clientX, y: event.clientY }, node };
	};

	onEdgeContextMenu = ({ event, edge }: { event: MouseEvent; edge: Edge }) => {
		event.preventDefault();
		this.resetState();
		this.ctxMenu = { type: 'edge', position: { x: event.clientX, y: event.clientY }, edge };
	};

	onSelectionContextMenu = ({ event }: { event: MouseEvent }) => {
		event.preventDefault();
		this.resetState();
		this.ctxMenu = { type: 'selection', position: { x: event.clientX, y: event.clientY } };
	};
}

export const uiManager = new UIManager();
