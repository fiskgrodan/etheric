import { readable } from "svelte/store";

export const hash = readable(window.location.hash, set => {
	window.onhashchange = () => set(window.location.hash);
});
