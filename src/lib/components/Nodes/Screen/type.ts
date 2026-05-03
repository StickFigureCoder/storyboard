import type { NodeProps } from '@xyflow/svelte';

export interface ScreenNodeProps extends NodeProps {
	data: {
		screen: {
			image?: {
				src: string;
				alt: string;
			};
			title: string;
			description: string;
		};
	};
}
