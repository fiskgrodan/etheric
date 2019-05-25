<div class="outer">
	<div class="inner">
		<ContentHeader />
		<slot />
	</div>
</div>

<script>
	import ContentHeader from "./ContentHeader.svelte";
</script>

<style>
	.outer {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		padding-top: 16px;
		padding-bottom: 16px;
		background-color: #dddddd;
	}

	.inner {
		width: 600px;
	}
</style>