<Container edit={() => edit(item)}>
	<div>{item.swedish}</div>
	<div>{item.english}</div>
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