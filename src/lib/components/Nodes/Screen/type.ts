export interface ScreenNode extends Record<string, unknown> {
	image?: {
		src: string;
		alt: string;
	};
	title: string;
	description: string;
}
