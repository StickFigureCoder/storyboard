import type { Edge, Node } from '@xyflow/svelte';
import type { ContextMenuMode, SidebarMode, ToolbarMode } from './type';

class Builder {
	nodes = $state.raw<Node[]>([]);
	edges = $state.raw<Edge[]>([]);

	toolbarMode = $state<ToolbarMode>({ type: 'selection' });
	sidebarMode = $state<SidebarMode>(null);
	ctxMenuMode = $state<ContextMenuMode>(null);

	constructor() {
		console.info('Builder Initilized Successfullty');
	}
	addNode = (data: Omit<Node, 'id'>) => {
		const node: Node = { ...data, id: crypto.randomUUID() };
		this.nodes = [...this.nodes, node];
	};
	addEdge = (edge: Edge) => {
		this.edges = [...this.edges, edge];
	};

	deleteNode = (node: Node) => {
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

	updateNode = (node: Node) => {
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

	// Event Handlers
	// GLOBAL & LIFECYCLE
	onInit = () => {}; // console.log;
	onError = () => {}; // console.log;
	onDBLClick = () => {}; // console.log;

	// NODES
	onNodeClick = () => {}; // console.log;
	onNodeContextMenu = () => {}; // console.log;
	onNodeDragStart = () => {}; // console.log;
	onNodeDragStop = () => {}; // console.log;

	// EDGES
	onEdgeClick = () => {}; // console.log;
	onEdgeContextMenu = () => {}; // console.log;

	// PANE (BACKGROUND)
	onPaneClick = () => {
		this.ctxMenuMode = null;
	}; // console.log;
	onPaneContextMenu = ({ event }: { event: MouseEvent }) => {
		event.preventDefault();
		this.ctxMenuMode = {
			type: 'panel',
			pos: { x: event.clientX, y: event.clientY }
		};
	}; // console.log;

	// CONNECTIONS
	onConnectStart = () => {}; // console.log;
	onConnect = () => {}; // console.log;
	onConnectEnd = () => {}; // console.log;

	// SELECTIONS
	onSelectionClick = () => {}; // console.log;
	onSelectionContextMenu = () => {}; // console.log;
	onSelectionStart = () => {}; // console.log;
	onSelectionEnd = () => {}; // console.log;
	onSelectionChange = () => {}; // console.log;
	onSelectionDragStart = () => {}; // console.log;
	onSelectionDragStop = () => {}; // console.log;

	// VIEWPORT / MOVEMENT
	onMoveStart = () => {}; // console.log;
	onMoveEnd = () => {}; // console.log;

	// STATE / DELETION
	onDelete = () => {}; // console.log;
}

export const builder = new Builder();
