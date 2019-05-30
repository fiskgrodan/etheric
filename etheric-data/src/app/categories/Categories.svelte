<Header id="categories" headerText="Kategorier" />
<Content>
	<ContentHeader type="categories" />
	{#each $sorted.categories as category (category.id)}
		<ContentRow 
			item={category} 
			edit={(id)=> {}}
			remove={(id) => store.removeCategory(id)}
		/>
	{/each}
	<CreateRow add={store.addCategory} />
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