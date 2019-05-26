<div transition:fade>
	<div class="container" class:hoverable={!noHover} transition:slide>
		<slot />
	</div>
</div>

<script>
	import { slide, fade } from 'svelte/transition';

	export let noHover = false;
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

	.container.hoverable:hover {
		cursor: pointer;
		background-color: #dddddd;
		color: #333333;
	}
</style>