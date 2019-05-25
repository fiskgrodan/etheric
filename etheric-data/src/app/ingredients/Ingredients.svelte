<Header id="ingredients" headerText="Ingredienser" />
<Content>
	<ContentRow 
		ingredient={{id: 1001, swedish: "Ananas", english: "Pineapple"}}
		edit={(id) => console.log('edit: ' + id)}
		remove={(id) => console.log('remove: ' + id)}
	/>
</Content>

<script>
	import Header from "../../components/main/Header.svelte";
	import Content from "../../components/content/Content.svelte";
	import ContentRow from "../../components/content/ContentRow.svelte";
</script>

<style>
	.container {
		width: 600px;
	}
</style>
