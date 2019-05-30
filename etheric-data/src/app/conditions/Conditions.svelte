<Header id="conditions" headerText="Tillstånd" />
<Content>
	<ContentHeader type="conditions" />
	{#each $sorted.conditions as condition (condition.id)}
		<ContentRow 
			item={condition} 
			edit={(id)=> {}}
			remove={(id) => store.removeCondition(id)}
		/>
	{/each}
	<CreateRow add={store.addCondition} />
</Content>

<script>
	import Header from "../../components/main/Header.svelte";
	import Content from "../../components/content/Content.svelte";
	import ContentHeader from "../../components/content/ContentHeader.svelte";
	import ContentRow from "../../components/content/ContentRow.svelte";
	import CreateRow from "../../components/content/create/CreateRow.svelte";
	import { store } from "../../stores/store.js";
	import { sorted } from "../../stores/sorted.js";
</script>