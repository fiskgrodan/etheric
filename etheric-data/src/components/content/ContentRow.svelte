<div transition:fade>
	<div class="container" transition:slide>
		<div class="text" on:click={()=> edit(item.id)}>{item.swedish}</div>
		<div class="text" on:click={()=> edit(item.id)}>{item.english}</div>
		<div class="remove" on:click={()=> remove(item.id)}>
			<Remove />
		</div>
	</div>
</div>

<script>
	import { slide, fade } from 'svelte/transition';
	import Remove from "../icons/Remove.svelte"

	export let item;
	export let edit;
	export let remove;
</script>

<style>
	.container {
		display: flex;
		border-radius: 8px;
		background-color: #ffffff;
		padding: 8px;
		padding-left: 12px;
		margin-bottom: 8px;
		transition: color 150ms ease-in-out 0ms, background-color 150ms ease-in-out 0ms;
	}

	.container:hover {
		cursor: pointer;
		background-color: #dddddd;
		color: #333333;
	}

	.text {
		display: flex;
		align-items: center;
		width: 260px;
		line-height: 1;
	}

	.remove {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex-grow: 1;
		transition: color 150ms ease-in-out 0ms;
		color: #999999;
		padding-right: 4px;
	}

	.remove:hover {
		color: #666666;
	}
</style>