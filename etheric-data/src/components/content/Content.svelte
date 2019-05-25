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
		padding-top: 12px;
		padding-bottom: 12px;
		background-color: #eeeeee;
	}

	.inner {
		width: 600px;
	}
</style>