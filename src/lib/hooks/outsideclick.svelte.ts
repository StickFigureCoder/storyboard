import type { Action } from 'svelte/action';

export const outsideclick: Action<HTMLElement, undefined, { onoutsideclick: () => void }> = (
	node
) => {
	$effect(() => {
		// Skip the current event loop tick so the opening click isn't caught
		let active = false;
		const enable = setTimeout(() => (active = true), 0);

		function handleClick(event: MouseEvent) {
			if (active && !node.contains(event.target as Node)) {
				node.dispatchEvent(new CustomEvent('outsideclick'));
			}
		}

		document.addEventListener('click', handleClick, true);

		return () => {
			clearTimeout(enable);
			document.removeEventListener('click', handleClick, true);
		};
	});
};
