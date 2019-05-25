<div id={id} class="container">
	<div class="wrapper">
		<h1>{headerText}</h1>
	</div>
</div>

<script>
	export let id;
	export let headerText = "";
</script>

<style>
	.container {
		display: flex;
		justify-content: center;
		height: 160px;
	}

	.wrapper {
		display: flex;
		align-items: flex-end;
		width: 600px;
		padding-bottom: 4px;
	}

	h1 {
		font-size: 20px;
		margin: 0;
	}
</style>