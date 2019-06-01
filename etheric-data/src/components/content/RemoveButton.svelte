<div on:click|stopPropagation>
	<Remove />
</div>

<script>
	import Remove from "../icons/Remove.svelte"
</script>

<style>
	div {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex-grow: 1;
		transition: color 150ms ease-in-out 0ms;
		color: #999999;
		padding-right: 4px;
	}

	div:hover {
		color: #666666;
	}
</style>