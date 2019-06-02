<Header id="conditions" headerText="Tillstånd" />
<Content>
	<ContentHeader type="conditions" />
	{#each $sorted.conditions as condition (condition.id)}
		<ContentRow 
			item={condition} 
			edit={condition => editCondition = JSON.parse(JSON.stringify(condition))}
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
<UpdateCondition editCondition={editCondition} close={() => editCondition = null} />

<script>
	import Header from "../../components/main/Header.svelte";
	import Content from "../../components/content/Content.svelte";
	import ContentHeader from "../../components/content/ContentHeader.svelte";
	import ContentRow from "../../components/content/ContentRow.svelte";
	import CreateRow from "../../components/content/create/CreateRow.svelte";
	import RemoveModal from "../../components/modal/RemoveModal.svelte";
	import UpdateModal from "../../components/modal/UpdateModal.svelte";
	import UpdateCondition from "./UpdateCondition.svelte";
	import { store } from "../../stores/store.js";
	import { sorted } from "../../stores/sorted.js";

	let editCondition = null;
	let removeConditionId = null;

	$: removeOpen = removeConditionId !== null;
</script>