<Container>
	<div on:click={() => edit(item)}>{item.swedish}</div>
	<div on:click={() => edit(item)}>{item.english}</div>
	<RemoveButton on:click={() => remove(item.id)} />
</Container>

<script>
	import Container from "./Container.svelte";
	import RemoveButton from "./RemoveButton.svelte"

	export let item;
	export let edit;
	export let remove;
</script>

<style>
	div {
		display: flex;
		align-items: center;
		width: 260px;
		line-height: 1;
	}
</style>