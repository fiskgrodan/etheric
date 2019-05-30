<Header id="ingredients" headerText="Ingredienser" />
<Content>
	<ContentHeader type="ingredients" />
	{#each $sorted.ingredients as ingredient (ingredient.id)}
		<ContentRow 
			item={ingredient} 
			edit={ingredient => editIngredient = ingredient}
			remove={id => removeIngredientId = id}
		/>
	{/each}
	<CreateRow add={store.addIngredient} />
</Content>
<RemoveModal 
	itemId={removeIngredientId} 
	open={removeOpen} 
	close={() => removeIngredientId = null} 
	remove={(id) => {
		store.removeIngredient(id);
		removeIngredientId = null;
	}}
	title="Ta bort ingrediensen"
>
	<div>Vill du ta bort den här ingrediensen?</div>
</RemoveModal>

<script>
	import Header from "../../components/main/Header.svelte";
	import Content from "../../components/content/Content.svelte";
	import ContentHeader from "../../components/content/ContentHeader.svelte";
	import ContentRow from "../../components/content/ContentRow.svelte";
	import CreateRow from "../../components/content/create/CreateRow.svelte";
	import RemoveModal from "../../components/modal/RemoveModal.svelte";
	import { store } from "../../stores/store.js";
	import { sorted } from "../../stores/sorted.js";

	let editIngredient = null; // TODO: use this
	let removeIngredientId = null;

	$: editOpen = editIngredient !== null; // TODO: use this
	$: removeOpen = removeIngredientId !== null;
</script>

<style>
	.container {
		width: 600px;
	}
</style>