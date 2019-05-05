<div class="container">
	<div class="line" class:current="{$hash === matchingHash}"></div>
</div>

<script>
	import { hash } from "../../stores/hash.js";

	export let matchingHash;
</script>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 1px;
		width: 100%;
		position: relative;
		bottom: -3px;
	}

	.line {
		height: 1px;
		background-color:rgba(255, 255, 255, 0.5);
		width: 0%;
		transition: width 150ms ease-in-out 0ms;
	}

	.current {
		width: 100%;
	}
</style>