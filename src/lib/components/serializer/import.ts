import type { State } from '../expression-enging/types';
import type { Content } from './schema';

const CURRENT_VERSION = '0.1.0';
const EXTENSION = 'storyboard';

export const exportToFile = (content: Content, state: State) => {
	const json = JSON.stringify({
		version: CURRENT_VERSION,
		content,
		state
	});

	const blob = new Blob([json], { type: 'application/json' });
	const url = URL.createObjectURL(blob);

	const a = document.createElement('a');
	a.href = url;
	a.download = content.name.replace(' ', '-') + '.' + EXTENSION;
	a.click();

	URL.revokeObjectURL(url);
};
