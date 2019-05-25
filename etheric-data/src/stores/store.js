import { writable } from 'svelte/store';
import { produce } from "immer";

const initialState = {
	ingredients: [
		{ id: 1001, swedish: "Ananas", english: "Pineapple" },
		{ id: 1002, swedish: "Jordgubbe", english: "Strawberry" },
		{ id: 1003, swedish: "Morot", english: "Carrot" },
		{ id: 1004, swedish: "Svamp", english: "Mushroom" },
		{ id: 1005, swedish: "Apelsin", english: "Orange" },
		{ id: 1006, swedish: "Kyckling", english: "Chicken" },
	],
	conditions: [
		{
			id: 1001,
			swedish: "Huvudvärd",
			english: "Headache",
			top: [1001, 1002],
			middle: [1003, 1004],
			top: [1005, 1006]
		}
	],
	categories: [
		{
			id: 1001,
			swedish: "Huvud",
			english: "Head",
			conditions: [1001]
		}
	]
};

const getNewId = items => items.reduce(
	(newId, item) => item.id >= newId ? item.id + 1 : newId,
	1001
);

const createStore = () => {
	const { subscribe, set, update } = writable(initialState);

	const upload = data => set(data);

	const addIngredient = ingredient => update(state => produce(state, draft => {
		draft.ingredients.push(ingredient);
	}));

	const removeIngredient = ingredientId => update(state => produce(state, draft => {
		draft.ingredients = state.ingredients.filter(ingredient => ingredientId !== ingredient.id)
	}));

	const removeCondition = conditionId => update(state => produce(state, draft => {
		draft.conditions = state.conditions.filter(condition => conditionId !== condition.id)
	}));

	return {
		subscribe,
		upload,
		addIngredient,
		removeIngredient,
		removeCondition
	};
};

export const store = createStore();
