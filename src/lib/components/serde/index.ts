import JSZip from 'jszip';
import type { WorldSchema } from './schema';
import { EXTENSION, WORLD_FILE } from '$lib';

interface World extends WorldSchema {
	assets: File[];
}

export const downloadWorld = async (world: World) => {
	const blob = await worldToBlob(world);
	const url = URL.createObjectURL(blob);

	const a = document.createElement('a');
	a.href = url;
	a.download =
		world.name
			.trim()
			.toLowerCase()
			.replaceAll(/[\\/:*?"<>|]/g, '_') +
		'.' +
		EXTENSION;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);

	URL.revokeObjectURL(url);
};

export const worldToBlob = async (world: World): Promise<Blob> => {
	const zip = new JSZip();

	const { assets, ...schema } = world;

	zip.file(WORLD_FILE, JSON.stringify(schema));

	const assetsFolder = zip.folder('assets');
	assets.forEach((asset) => assetsFolder?.file(asset.name, asset));

	return zip.generateAsync({ type: 'blob' });
};

export const fileToWorld = async (file: File): Promise<World> => {
	const zip = await JSZip.loadAsync(file);

	const worldFile = zip.file(WORLD_FILE);
	if (!worldFile) throw new Error(`Invalid .${EXTENSION} file: missing ${WORLD_FILE}`);

	const schema = JSON.parse(await worldFile.async('string')) as WorldSchema;

	const assetsFolder = zip.folder('assets');
	const assets: File[] = [];

	if (assetsFolder) {
		const assetPromises: Promise<File>[] = [];

		assetsFolder.forEach((relativePath, entry) => {
			if (!entry.dir) {
				assetPromises.push(entry.async('blob').then((blob) => new File([blob], relativePath)));
			}
		});

		assets.push(...(await Promise.all(assetPromises)));
	}

	return { ...schema, assets };
};
