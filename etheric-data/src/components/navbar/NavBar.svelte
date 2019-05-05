<nav class="navbar">
	<div class="logo">Etheric Data</div>
	<Link label="Ingredienser" matchingHash="#/ingredients" />
	<Link label="Tillstånd" matchingHash="#/conditions" />
	<Link label="Kategorier" matchingHash="#/categories" />
</nav>

<script>
	import Link from "./Link.svelte";
</script>

<style>
	.navbar {
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		height: 50px;
		background-color: #1e87f0;
		color: white;
		width: 100%;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
		padding-left: 20px;
		padding-right: 20px;
	}

	.logo {
		padding-left: 20px;
		padding-right: 20px;
		opacity: 0.5;
	}
</style>