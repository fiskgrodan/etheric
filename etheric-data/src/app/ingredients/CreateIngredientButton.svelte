<div class:enabled={enabled} on:click>
	<label>
		<Add />
		<input type="submit" style="display: none;">
	</label>
</div>

<script>
	import Add from "../../components/icons/Add.svelte"

	export let enabled = false;
</script>

<style>
	div {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 4px;
		height: 24px;
		width: 24px;
		line-height: 1;
		color: #ffffff;
		background-color: #999999;
		transition: background-color 150ms ease-in-out 0ms, opacity 250ms ease-in-out 0ms;
		opacity: 0.333;
	}

	div.enabled {
		background-color: var(--primary-color);
		opacity: 1;
	}

	div.enabled:hover {
		cursor: pointer;
		background-color: var(--primary-dark-color);
	}
</style>