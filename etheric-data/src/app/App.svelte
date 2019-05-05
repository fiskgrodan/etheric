<NavBar />
<main>
	{#if $hash === "#/ingredients"}
		<Ingredients />
	{:else if $hash === "#/conditions"}
		<h1>Tillstånd</h1>
	{:else if $hash === "#/categories"}
		<h1>Kategorier</h1>
	{:else}
		<h1>Home</h1>
	{/if}
</main>

<script>
	import { hash } from "../stores/hash.js";
	import { media } from "../stores/media.js";
	import NavBar from "../components/navbar/NavBar.svelte";
	import Ingredients from "./ingredients/Ingredients.svelte";
</script>

<style>
	:global(body) {
		font-family: 'Source Sans Pro', sans-serif;
		margin: 0;
		padding: 0;
		color: #666;
	}

	main {
		padding-top: 50px;
	}
</style>