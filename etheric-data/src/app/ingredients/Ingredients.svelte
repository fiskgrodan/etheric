<Header id="ingredients" headerText="Ingredienser" />
<Content>
	{#each $store.ingredients as ingredient (ingredient.id)}
		<ContentRow 
			ingredient={ingredient} 
			edit={(id)=> {}}
			remove={(id) => store.removeIngredient(id)}
		/>
	{/each}
</Content>

<script>
	import Header from "../../components/main/Header.svelte";
	import Content from "../../components/content/Content.svelte";
	import ContentRow from "../../components/content/ContentRow.svelte";
	import { store } from "../../stores/store.js";
</script>

<style>
	.container {
		width: 600px;
	}
</style>