<div class="container">
	<div class="text" on:click={() => edit(ingredient.id)}>{ingredient.swedish}</div>
	<div class="text" on:click={() => edit(ingredient.id)}>{ingredient.english}</div>
	<div class="remove" on:click={() => remove(ingredient.id)}><Remove /></div>
</div>

<script>
	import Remove from "../icons/Remove.svelte"
	export let ingredient;
	export let edit;
	export let remove;
</script>

<style>
	.container {
		display: flex;
		border-radius: 8px;
		background-color: #ffffff;
		padding: 8px;
		margin-bottom: 8px;
	}
	.container:hover {
		cursor: pointer;
	}

	.text {
		display: flex;
		align-items: center;
		width: 260px;
		transition: color 150ms ease-in-out 0ms;
		line-height: 1;
	}
	.text:hover {
		color: #999999;
	}

	.remove {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex-grow: 1;
		transition: color 150ms ease-in-out 0ms;
		color: #999999;
	}
	.remove:hover {
		color: #666666;
	}
</style>
