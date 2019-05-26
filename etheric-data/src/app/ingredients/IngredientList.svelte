{#each $store.ingredients as ingredient (ingredient.id)}
	<ContentRow 
		item={ingredient} 
		edit={(id)=> {}}
		remove={(id) => store.removeIngredient(id)}
	/>
{/each}

<script>
	import ContentRow from "../../components/content/ContentRow.svelte";
	import { store } from "../../stores/store.js";
</script>