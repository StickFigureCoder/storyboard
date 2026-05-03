import type { Edge, Node } from '@xyflow/svelte';

let nodes = $state.raw<Node[]>([]);
let edges = $state.raw<Edge[]>([]);

let canvasMode = $state('pan');

let panOnDrag = $derived<boolean>(canvasMode === 'pan');
let selectionOnDrag = $state<boolean>(canvasMode === 'selection');
let zoomOnDoubleClick = $state<boolean>(false);

export const board = {
	get nodes() {
		return nodes;
	},
	set nodes(v) {
		nodes = v;
	},
	get edges() {
		return edges;
	},
	set edges(v) {
		edges = v;
	},
	get panOnDrag() {
		return panOnDrag;
	},
	set panOnDrag(v) {
		panOnDrag = v;
	},
	get selectionOnDrag() {
		return selectionOnDrag;
	},
	set selectionOnDrag(v) {
		selectionOnDrag = v;
	},
	get zoomOnDoubleClick() {
		return zoomOnDoubleClick;
	},
	set zoomOnDoubleClick(v) {
		zoomOnDoubleClick = v;
	},
	get canvasMode() {
		return canvasMode;
	},
	set canvasMode(v) {
		canvasMode = v;
	}
};

export const addNode = (node: Node) => {
	nodes = [...nodes, node];
};

export const addEdge = (edge: Edge) => {
	edges = [...edges, edge];
};

export const updateNode = (node: Node) => {
	let found = false;

	nodes = nodes.map((prob) => {
		if (prob.id === node.id) {
			found = true;
			return node;
		} else {
			return prob;
		}
	});

	return found;
};

export const updateEdge = (edge: Edge) => {
	let found = false;

	edges = edges.map((prob) => {
		if (prob.id === edge.id) {
			found = true;
			return edge;
		} else {
			return prob;
		}
	});

	return found;
};

export const deleteNode = (node: Node) => {
	nodes = nodes.filter((prob) => prob.id !== node.id);
};

export const deleteEdge = (edge: Edge) => {
	edges = edges.filter((prob) => prob.id !== edge.id);
};

export const deleteSelectedNodes = () => {
	nodes = nodes.filter((prob) => !prob.selected);
};

export const deleteSelectedEdges = () => {
	edges = edges.filter((prob) => !prob.selected);
};

export const deleteSelected = () => {
	deleteSelectedNodes();
	deleteSelectedEdges();
};

// Event Handlers
// GLOBAL & LIFECYCLE
export const onInit = () => {}; // console.log;
export const onError = () => {}; // console.log;
export const onDBLClick = () => {}; // console.log;

// NODES
export const onNodeClick = () => {}; // console.log;
export const onNodeContextMenu = () => {}; // console.log;
export const onNodeDragStart = () => {}; // console.log;
export const onNodeDragStop = () => {}; // console.log;

// EDGES
export const onEdgeClick = () => {}; // console.log;
export const onEdgeContextMenu = () => {}; // console.log;

// PANE (BACKGROUND)
export const onPaneClick = () => {}; // console.log;
export const onPaneContextMenu = () => {}; // console.log;

// CONNECTIONS
export const onConnectStart = () => {}; // console.log;
export const onConnect = () => {}; // console.log;
export const onConnectEnd = () => {}; // console.log;

// SELECTIONS
export const onSelectionClick = () => {}; // console.log;
export const onSelectionContextMenu = () => {}; // console.log;
export const onSelectionStart = () => {}; // console.log;
export const onSelectionEnd = () => {}; // console.log;
export const onSelectionChange = () => {}; // console.log;
export const onSelectionDragStart = () => {}; // console.log;
export const onSelectionDragStop = () => {}; // console.log;

// VIEWPORT / MOVEMENT
export const onMoveStart = () => {}; // console.log;
export const onMoveEnd = () => {}; // console.log;

// STATE / DELETION
export const onDelete = () => {}; // console.log;
