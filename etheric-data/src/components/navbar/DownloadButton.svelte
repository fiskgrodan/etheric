<a download="etheric-data.json" href={downloadHref}>
	<Download />
</a>

<script>
	import Download from "../icons/Download.svelte";
	import { store } from "../../stores/store.js";

	$: downloadHref = `data:text/json;charset=utf-8,${JSON.stringify({
		ingredients: $store.ingredients,
		conditions: $store.conditions,
		categories: $store.categories,
	}, null, 2)}`
</script>

<style>
	a {
		color: #ffffff;
		transition: color 150ms ease-in-out 0ms;
		line-height: 1;
		margin-left: 32px;
		user-select: none;
		text-decoration: none;
	}

	a:hover {
		cursor: pointer;
		color: #cce5ff;
	}
</style>