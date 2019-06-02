<UpdateModal item={$editCategory} open={$isOpen} close={()=> editCategory.clear()}
	update={update}
	title="Ändra kategori"
	>
	<div class="container">
		<div class="row">
			<div class="header">Tillstånd</div>
		</div>
		<div class="row">
			<div class="select-wrapper">
				<Select options={$selectableConditions} select={conditionId=> editCategory.addCondition(conditionId)}/>
			</div>
		</div>
		<div class="row">
			{#each $sortedConditions as condition (condition.id)}
				<div class="condition" transition:fade on:click={() => editCategory.removeCondition(condition.id)}>
					{condition.swedish}
				</div>
			{/each}
		</div>
	</div>
</UpdateModal>

<script>
	import UpdateModal from "../../components/modal/UpdateModal.svelte";
	import Select from "../../components/form/Select.svelte";
	import { fade } from 'svelte/transition';
	import { store } from "../../stores/store.js";
	import { editCategory, isOpen, selectableConditions, sortedConditions } from "./editCategory.js";

	const update = () => {
		store.updateCategory($editCategory);
		editCategory.clear();
	}
</script>

<style>
	.container {
		padding-top: 20px;
		padding-bottom: 10px;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		margin-bottom: 4px;
	}

	.header {
		flex-grow: 1;
		flex-basis: 50%;
		font-size: 12px;
	}

	.select-wrapper {
		flex-grow: 1;
		flex-basis: 50%;
		max-width: 50%;
	}

	.condition {
		flex-grow: 1;
		flex-basis: 100%;
	}
	.condition:hover {
		cursor: pointer;
	}
</style>