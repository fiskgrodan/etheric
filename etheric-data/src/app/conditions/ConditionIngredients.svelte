<div class="selected-ingredients">
	{#each sortedBase as base (base.id)}
		<div on:click={() => remove(base.id, "base")} transition:fade>
			{base.swedish}
		</div>
	{/each}
</div>
<div class="selected-ingredients">
	{#each sortedMiddle as middle (middle.id)}
		<div on:click={() => remove(middle.id, "middle")} transition:fade>
			{middle.swedish}
		</div>
	{/each}
</div>
<div class="selected-ingredients">
	{#each sortedTop as top (top.id)}
		<div on:click={() => remove(top.id, "top")} transition:fade>
			{top.swedish}
		</div>
	{/each}
</div>

<script>
	import { fade } from 'svelte/transition';
	import { store } from "../../stores/store.js";

	export let editCondition;
	export let remove = () => { };

	// TODO: redo these with a derived store?
	$: sortedBase = $store.ingredients
	.filter(ingredient => editCondition.base.includes(ingredient.id))
	.sort((a, b) => a.swedish > b.swedish ? 1 : -1);

	$: sortedMiddle = $store.ingredients
	.filter(ingredient => editCondition.middle.includes(ingredient.id))
	.sort((a, b) => a.swedish > b.swedish ? 1 : -1);

	$: sortedTop = $store.ingredients
	.filter(ingredient => editCondition.top.includes(ingredient.id))
	.sort((a, b) => a.swedish > b.swedish ? 1 : -1);
</script>

<style>
	.selected-ingredients {
		flex-grow: 1;
		flex-basis: 33.33%;
		padding-right: 10px;
	}
	.selected-ingredients:hover {
		cursor: pointer;
	}
</style>