<Header id="categories" headerText="Kategorier" />
<Content>
	<ContentHeader type="categories" />
	{#each $sorted.categories as category (category.id)}
		<ContentRow 
			item={category} 
			edit={item => editCategory.set(item)}
			remove={id => removeCategoryId = id}
		/>
	{/each}
	<CreateRow add={store.addCategory} />
</Content>
<RemoveModal 
	itemId={removeCategoryId} 
	open={removeOpen} 
	close={() => removeCategoryId = null} 
	remove={(id) => {
		store.removeCategory(id);
		removeCategoryId = null;
	}}
	title="Ta bort kategori"
>
	<div>Vill du ta bort den här kategorin?</div>
</RemoveModal>
<UpdateCategory />

<script>
	import Header from "../../components/main/Header.svelte";
	import Content from "../../components/content/Content.svelte";
	import ContentHeader from "../../components/content/ContentHeader.svelte";
	import ContentRow from "../../components/content/ContentRow.svelte";
	import CreateRow from "../../components/content/create/CreateRow.svelte";
	import RemoveModal from "../../components/modal/RemoveModal.svelte";
	import UpdateCategory from "./UpdateCategory.svelte";
	import { store } from "../../stores/store.js";
	import { sorted } from "../../stores/sorted.js";
	import { editCategory } from "./editCategory.js";

	let removeCategoryId = null;

	$: removeOpen = removeCategoryId !== null;
</script>