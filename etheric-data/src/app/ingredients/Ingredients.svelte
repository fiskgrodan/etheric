<div class="container">
	<h1>Ingredienser</h1>
	<Button on:click={()=> console.log('click')}>
		Lägg till en ny ingrediens
	</Button>
</div>

<script>
	import Button from "../../components/buttons/Button.svelte";
</script>

<style>
	.container {
		padding: 40px 80px;
	}
</style>