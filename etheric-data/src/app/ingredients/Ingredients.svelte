<Header id="ingredients" headerText="Ingredienser" />
<Content>
	<ContentHeader type="ingredients" />
	{#each $sorted.ingredients as ingredient (ingredient.id)}
		<ContentRow 
			item={ingredient} 
			edit={(id)=> {}}
			remove={(id) => store.removeIngredient(id)}
		/>
	{/each}
	<CreateRow add={store.addIngredient} />
</Content>

<script>
	import Header from "../../components/main/Header.svelte";
	import Content from "../../components/content/Content.svelte";
	import ContentHeader from "../../components/content/ContentHeader.svelte";
	import ContentRow from "../../components/content/ContentRow.svelte";
	import CreateRow from "../../components/content/create/CreateRow.svelte";
	import { store } from "../../stores/store.js";
	import { sorted } from "../../stores/sorted.js";
</script>

<style>
	.container {
		width: 600px;
	}
</style>