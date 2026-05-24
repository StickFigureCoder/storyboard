import type { Edge } from '@xyflow/svelte';
import type { ContextMenuMode, SidebarMode, ToolbarMode } from './type';
import type { Nodes } from '../Nodes';

class Builder {
	nodes = $state.raw<Nodes[]>([]);
	edges = $state.raw<Edge[]>([]);

	// Panels Mode
	toolbarMode = $state<ToolbarMode>({ type: 'selection' });
	sidebarMode = $state<SidebarMode>(null);
	ctxMenuMode = $state<ContextMenuMode>(null);

	// Internal
	toolSelected = $derived(this.toolbarMode.type);

	constructor() {
		console.info('Builder Initilized Successfullty');
	}

	insertNode = (data: Omit<Nodes, 'id'>) => {
		const node: Nodes = { ...data, id: crypto.randomUUID() };
		this.nodes = [...this.nodes, node];
	};
	insertEdge = (edge: Edge) => {
		this.edges = [...this.edges, edge];
	};

	deleteNode = (node: Nodes) => {
		this.nodes = this.nodes.filter((prob) => prob.id !== node.id);
	};
	deleteEdge = (edge: Edge) => {
		this.edges = this.edges.filter((prob) => prob.id !== edge.id);
	};
	deleteSelectedNodes = () => {
		this.nodes = this.nodes.filter((prob) => !prob.selected);
	};
	deleteSelectedEdges = () => {
		this.edges = this.edges.filter((prob) => !prob.selected);
	};
	deleteSelected = () => {
		this.deleteSelectedNodes();
		this.deleteSelectedEdges();
	};

	updateNode = (node: Nodes) => {
		let found = false;

		this.nodes = this.nodes.map((prob) => {
			if (prob.id === node.id) {
				found = true;
				return node;
			} else {
				return prob;
			}
		});

		return found;
	};
	updateEdge = (edge: Edge) => {
		let found = false;

		this.edges = this.edges.map((prob) => {
			if (prob.id === edge.id) {
				found = true;
				return edge;
			} else {
				return prob;
			}
		});

		return found;
	};

	upsertEdge = (edge: Edge) => {
		if (!this.updateEdge(edge)) this.insertEdge(edge);
	};
	upsertNode = (node: Nodes) => {
		if (!this.updateNode(node)) this.insertNode(node);
	};

	duplicateNode = (node: Nodes) => {
		const newNode = {
			id: crypto.randomUUID(),
			position: { x: node.position.x + 200, y: node.position.y + 200 },
			type: node.type,
			data: node.data
		};

		this.insertNode(newNode);
	};
	duplicateSelection = () => {};

	// Event Handlers
	// GLOBAL & LIFECYCLE
	onInit = () => {};
	onError = () => {};
	onDBLClick = () => {};

	// NODES
	onNodeClick = ({ node }: { event: MouseEvent | TouchEvent; node: Nodes }) => {
		this.sidebarMode = { type: 'node', node };
	};
	onNodeContextMenu = ({ event, node }: { event: MouseEvent | TouchEvent; node: Nodes }) => {
		event.preventDefault();
		if (!('clientX' in event)) return;
		this.ctxMenuMode = {
			type: 'node',
			pos: { x: event.clientX, y: event.clientY },
			node
		};
	};
	onNodeDragStart = () => {};
	onNodeDragStop = () => {};

	// EDGES
	onEdgeClick = () => {};
	onEdgeContextMenu = ({ event, edge }: { event: MouseEvent | TouchEvent; edge: Edge }) => {
		event.preventDefault();
		if (!('clientX' in event)) return;
		this.ctxMenuMode = {
			type: 'edge',
			pos: { x: event.clientX, y: event.clientY },
			edge
		};
	};

	// PANE (BACKGROUND)
	onPaneClick = () => {
		this.ctxMenuMode = null;
	};
	onPaneContextMenu = ({ event }: { event: MouseEvent | TouchEvent }) => {
		event.preventDefault();
		if (!('clientX' in event)) return;
		this.ctxMenuMode = {
			type: 'panel',
			pos: { x: event.clientX, y: event.clientY }
		};
	};

	// CONNECTIONS
	onConnectStart = () => {};
	onConnect = () => {};
	onConnectEnd = () => {};

	// SELECTIONS
	onSelectionClick = () => {};
	onSelectionContextMenu = ({ event }: { event: MouseEvent | TouchEvent; nodes: Nodes[] }) => {
		event.preventDefault();
		if (!('clientX' in event)) return;
		this.ctxMenuMode = {
			type: 'selection',
			pos: { x: event.clientX, y: event.clientY }
		};
	};
	onSelectionStart = () => {};
	onSelectionEnd = () => {};
	onSelectionChange = () => {};
	onSelectionDragStart = () => {};
	onSelectionDragStop = () => {};

	// VIEWPORT / MOVEMENT
	onMoveStart = () => {};
	onMoveEnd = () => {};

	// STATE / DELETION
	onDelete = () => {};
}

export const builder = new Builder();
