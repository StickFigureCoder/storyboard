// ── Menu config ──────────────────────────────────────────────────────────
type MenuLabel = { type: 'label'; label: string };
type MenuItem = {
	type: 'item';
	label: string;
	action: string;
	shortcut?: string;
	destructive?: boolean;
};
type MenuSeparator = { type: 'separator' };
type MenuSubmenu = { type: 'submenu'; label: string; children: MenuItem[] };
export type MenuEntry = MenuLabel | MenuItem | MenuSeparator | MenuSubmenu;

export const panelMenu: MenuEntry[] = [
	{ type: 'label', label: 'Panel' },
	{ type: 'item', label: 'New Screen', action: 'new-screen' },
	{ type: 'item', label: 'Fit View', action: 'fit-view' },
	{ type: 'separator' },
	{ type: 'label', label: 'Danger' },
	{ type: 'separator' },
	{ type: 'item', label: 'Delete node', action: 'delete', shortcut: '⌫', destructive: true }
];

export const nodeMenu: MenuEntry[] = [
	{ type: 'label', label: 'Node' },
	{ type: 'item', label: 'Edit', action: 'rename', shortcut: 'R' },
	{ type: 'item', label: 'Duplicate', action: 'duplicate', shortcut: 'D' },
	{ type: 'separator' },
	{ type: 'label', label: 'Danger' },
	{ type: 'separator' },
	{ type: 'item', label: 'Delete node', action: 'delete', shortcut: '⌫', destructive: true }
];

export const edgeMenu: MenuEntry[] = [
	{ type: 'label', label: 'Edge' },
	{ type: 'item', label: 'Edit', action: 'rename', shortcut: 'R' },
	{ type: 'item', label: 'Duplicate', action: 'duplicate', shortcut: 'D' },
	{ type: 'separator' },
	{ type: 'label', label: 'Danger' },
	{ type: 'separator' },
	{ type: 'item', label: 'Delete node', action: 'delete', shortcut: '⌫', destructive: true }
];

export const selectionMenu: MenuEntry[] = [
	{ type: 'label', label: 'Edge' },
	{ type: 'item', label: 'Edit', action: 'rename', shortcut: 'R' },
	{ type: 'item', label: 'Duplicate', action: 'duplicate', shortcut: 'D' },
	{ type: 'separator' },
	{ type: 'label', label: 'Danger' },
	{ type: 'separator' },
	{ type: 'item', label: 'Delete node', action: 'delete', shortcut: '⌫', destructive: true }
];

export const getMenu = (
	menuType: 'panel' | 'node' | 'edge' | 'selection' | undefined
): MenuEntry[] => {
	switch (menuType) {
		case 'panel':
			return panelMenu;
		case 'node':
			return nodeMenu;
		case 'edge':
			return edgeMenu;
		case 'selection':
			return selectionMenu;
		default:
			return [];
	}
};
