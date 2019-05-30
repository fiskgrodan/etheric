<div class="container">
	<div class="language-header" on:click={()=> sorting.change(type, "swedish")}>Svenska</div>
	<div class="language-header" on:click={()=> sorting.change(type, "english")}>Engelska</div>
	<div />
</div>

<script>
	import { sorting } from "../../stores/sorting.js";

	export let type;
</script>

<style>
	.container {
		display: flex;
		width: 576px;
		font-size: 12px;
		padding-left: 12px;
		padding-right: 12px;
		padding-bottom: 8px;
	}

	.language-header {
		width: 260px;
		user-select: none;
		transition: color 150ms ease-in-out 0ms;
	}

	.language-header:hover {
		cursor: pointer;
		color: #999999;
	}
</style>