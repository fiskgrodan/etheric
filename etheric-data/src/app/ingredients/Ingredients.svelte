<Header id="ingredients" headerText="Ingredienser" />
<Content>
	<IngredientList />
	<CreateIngredient />
</Content>

<script>
	import Header from "../../components/main/Header.svelte";
	import Content from "../../components/content/Content.svelte";
	import IngredientList from "./IngredientList.svelte";
	import CreateIngredient from "./CreateIngredient.svelte";
</script>

<style>
	.container {
		width: 600px;
	}
</style>