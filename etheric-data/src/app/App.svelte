<Navbar />
<main>
	<Ingredients />
	<Conditions />
	<Categories />
	<Footer />
</main>

<script>
	import Navbar from "../components/navbar/Navbar.svelte";
	import Ingredients from "./ingredients/Ingredients.svelte";
	import Conditions from "./conditions/Conditions.svelte";
	import Categories from "./categories/Categories.svelte";
	import Footer from "../components/main/Footer.svelte";
</script>

<style>
	:global(html) {
		font-family: ProximaNova, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
		color: #666666;
		scroll-behavior: smooth;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		overflow-y: scroll;
	}

	:global(:root) {
		--primary-color: #1e87f0;
		--primary-dark-color: #0e6dcd;
		--secondary-color: #f0506e;
		--secondary-dark-color: #ec2147;
	}
</style>
