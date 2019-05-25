<Header id="conditions" headerText="Tillstånd" />
<Content>
		{#each $store.conditions as condition (condition.id)}
			<ContentRow 
				item={condition} 
				edit={(id)=> {}}
				remove={(id) => store.removeCondition(id)}
			/>
		{/each}
	</Content>

<script>
	import Header from "../../components/main/Header.svelte";
	import Content from "../../components/content/Content.svelte";
	import ContentRow from "../../components/content/ContentRow.svelte";
	import { store } from "../../stores/store.js";
</script>
