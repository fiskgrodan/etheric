import { writable } from 'svelte/store';
import { produce } from "immer";

const initialState = {
	ingredients: [],
	conditions: [],
	categories: []
};

const getNewId = items => items.reduce(
	(newId, item) => item.id >= newId ? item.id + 1 : newId,
	1001
);

const createStore = () => {
	// Init
	const { subscribe, set, update } = writable(initialState);

	// Upload
	const upload = data => set(data);

	// Add
	const addItem = (swedish, english, type) => update(state => produce(state, draft => {
		draft[type].push({
			id: getNewId(state[type]),
			swedish,
			english
		});
	}));

	const addIngredient = (swedish, english) => addItem(swedish, english, "ingredients");

	const addCondition = (swedish, english) => addItem(swedish, english, "conditions");

	const addCategory = (swedish, english) => addItem(swedish, english, "categories");

	// Remove
	const removeIngredient = ingredientId => update(state => produce(state, draft => {
		draft.ingredients = state.ingredients.filter(ingredient => ingredientId !== ingredient.id)
	}));

	const removeCondition = conditionId => update(state => produce(state, draft => {
		draft.conditions = state.conditions.filter(condition => conditionId !== condition.id)
	}));

	const removeCategory = categoryId => update(state => produce(state, draft => {
		draft.categories = state.categories.filter(category => categoryId !== category.id)
	}));

	// Return
	return {
		subscribe,
		upload,
		addIngredient,
		removeIngredient,
		addCondition,
		removeCondition,
		addCategory,
		removeCategory
	};
};

export const store = createStore();
