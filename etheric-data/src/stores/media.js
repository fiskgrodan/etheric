import { readable } from "svelte/store";

const mobileQuery = "(max-width: 700px)";

export const media = readable(!!window.matchMedia(mobileQuery).matches, set => {
	const mql = window.matchMedia(mobileQuery);
	const onChange = () => set(!!mql.matches);
	mql.addListener(onChange);

	return () => mql.removeListener(onChange);
});
