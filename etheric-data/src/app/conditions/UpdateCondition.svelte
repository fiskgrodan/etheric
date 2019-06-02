<UpdateModal item={editCondition} open={editOpen} close={()=> close()}
	update={item => {
	store.updateCondition(item);
	editCondition = null;
	}}
	title="Ändra tillstånd"
	>
	<div class="container">
		<div class="row">
			<div class="header">Bas</div>
			<div class="header">Mellan</div>
			<div class="header">Topp</div>
		</div>
		<div class="row">
			<div class="select-wrapper">
				<Select options={filterNotSelected($store.ingredients, editCondition.base)} select={ingredientId=>
					addIngredient(ingredientId, "base")}/>
			</div>
			<div class="select-wrapper">
				<Select options={filterNotSelected($store.ingredients, editCondition.middle)} select={ingredientId=>
					addIngredient(ingredientId, "middle")}/>
			</div>
			<div class="select-wrapper">
				<Select options={filterNotSelected($store.ingredients, editCondition.top)} select={ingredientId=>
					addIngredient(ingredientId, "top")}
					/>
			</div>
		</div>
		<div class="row">
			<ConditionIngredients editCondition={editCondition} remove={(id, type)=> removeIngredient(id, type)}
				/>
		</div>
	</div>
</UpdateModal>

<script>
	import UpdateModal from "../../components/modal/UpdateModal.svelte";
	import Select from "../../components/form/Select.svelte";
	import ConditionIngredients from "./ConditionIngredients.svelte";
	import { store } from "../../stores/store.js";

	export let editCondition;
	export let close;

	$: editOpen = editCondition !== null;

	const addIngredient = (ingredientId, type) => {
		editCondition[type] = [...editCondition[type], ingredientId];
	}

	const removeIngredient = (ingredientId, type) => {
		editCondition[type] = editCondition[type].filter(id => id !== ingredientId);
	}

	const filterNotSelected = (ingredients, selected) => ingredients.filter(ingredient => !selected.includes(ingredient.id));
</script>

<style>
	.container {
		padding-top: 20px;
		padding-bottom: 10px;
	}

	.row {
		display: flex;
		width: 100%;
		margin-bottom: 4px;
	}

	.header {
		flex-grow: 1;
		flex-basis: 33.33%;
		font-size: 12px;
	}

	.select-wrapper {
		flex-grow: 1;
		flex-basis: 33.33%;
		padding-right: 20px;
	}
</style>