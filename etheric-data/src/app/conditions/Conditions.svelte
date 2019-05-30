<Header id="conditions" headerText="Tillstånd" />
<Content>
	<ContentHeader type="conditions" />
	{#each $sorted.conditions as condition (condition.id)}
		<ContentRow 
			item={condition} 
			edit={()=> {}}
			remove={id => removeConditionId = id}
		/>
	{/each}
	<CreateRow add={store.addCondition} />
</Content>
<RemoveModal 
	itemId={removeConditionId} 
	open={removeOpen} 
	close={() => removeConditionId = null} 
	remove={(id) => {
		store.removeCondition(id);
		removeConditionId = null;
	}}
	title="Ta bort tillstånd"
>
	<div>Vill du ta bort det här tillståndet?</div>
</RemoveModal>

<script>
	import Header from "../../components/main/Header.svelte";
	import Content from "../../components/content/Content.svelte";
	import ContentHeader from "../../components/content/ContentHeader.svelte";
	import ContentRow from "../../components/content/ContentRow.svelte";
	import CreateRow from "../../components/content/create/CreateRow.svelte";
	import RemoveModal from "../../components/modal/RemoveModal.svelte";
	import { store } from "../../stores/store.js";
	import { sorted } from "../../stores/sorted.js";

	let removeConditionId = null;

	$: removeOpen = removeConditionId !== null;
</script>