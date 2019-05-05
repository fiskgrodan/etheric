<a href={matchingHash} class="link">
	<div>
		<div class="link-text">{label}</div>
		<Underline matchingHash={matchingHash} />
	</div>
</a>

<script>
	import Underline from "./Underline.svelte";

	export let label = "";
	export let matchingHash;
</script>

<style>
	.link {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		color: inherit;
		text-decoration: none;
		padding-left: 20px;
		padding-right: 20px;
		height: 100%;
		transition: background-color 150ms ease-in-out 0ms;
	}

	.link:hover {
		cursor: pointer;
		background-color: rgba(255, 255, 255, 0.1)
	}

	.link-text {
		flex-basis: 100%;
	}
</style>