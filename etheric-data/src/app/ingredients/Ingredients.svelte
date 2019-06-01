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
	remove={id => {
		store.removeIngredient(id);
		removeIngredientId = null;
	}}
	title="Ta bort ingrediens"
>
	<div>Vill du ta bort den här ingrediensen?</div>
</RemoveModal>
<UpdateModal 
	item={editIngredient} 
	open={editOpen} 
	close={() => editIngredient = null} 
	update={item => {
		store.updateIngredient(item);
		editIngredient = null;
	}}
	title="Ändra ingrediens"
/>

<script>
	import Header from "../../components/main/Header.svelte";
	import Content from "../../components/content/Content.svelte";
	import ContentHeader from "../../components/content/ContentHeader.svelte";
	import ContentRow from "../../components/content/ContentRow.svelte";
	import CreateRow from "../../components/content/create/CreateRow.svelte";
	import RemoveModal from "../../components/modal/RemoveModal.svelte";
	import UpdateModal from "../../components/modal/UpdateModal.svelte";
	import { store } from "../../stores/store.js";
	import { sorted } from "../../stores/sorted.js";

	let editIngredient = null;
	let removeIngredientId = null;

	$: editOpen = editIngredient !== null;
	$: removeOpen = removeIngredientId !== null;
</script>