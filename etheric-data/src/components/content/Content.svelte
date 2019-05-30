<div class="outer">
	<div class="inner">
		<slot />
	</div>
</div>

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