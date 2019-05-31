<div class:enabled={enabled} on:click>
	<label>
		<Add />
		<input type="submit" style="display: none;">
	</label>
</div>

<script>
	import Add from "../../icons/Add.svelte"

	export let enabled = false;
</script>

<style>
	div {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 4px;
		height: 22px;
		width: 22px;
		line-height: 1;
		color: #ffffff;
		background-color: #dddddd;
		transition: background-color 150ms ease-in-out 0ms;
	}

	div.enabled {
		background-color: var(--primary-color);
	}

	div.enabled:hover {
		cursor: pointer;
		background-color: var(--primary-dark-color);
	}

	div.enabled label {
		cursor: pointer;
	}
</style>