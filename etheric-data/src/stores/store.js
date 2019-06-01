import { writable } from 'svelte/store';
import { produce } from "immer";

const localStorageState = localStorage.getItem("store");

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
	const { subscribe, set, update } = writable(localStorageState ? JSON.parse(localStorageState) : initialState);

	const upload = data => set(data);

	// Create
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

	// Update
	const updateItem = (newItem, type) => update(state => produce(state, draft => {
		draft[type] = state[type].map(item => {
			if (item.id === newItem.id) {
				return newItem;
			}
			return item;
		});
	}));

	const updateIngredient = newIngredient => updateItem(newIngredient, "ingredients");

	const updateCondition = newCondition => updateItem(newCondition, "conditions");

	const updateCategory = newCategory => updateItem(newCategory, "categories");

	// Delete
	const removeIngredient = ingredientId => update(state => produce(state, draft => {
		draft.ingredients = state.ingredients.filter(ingredient => ingredientId !== ingredient.id)
	}));

	const removeCondition = conditionId => update(state => produce(state, draft => {
		draft.conditions = state.conditions.filter(condition => conditionId !== condition.id)
	}));

	const removeCategory = categoryId => update(state => produce(state, draft => {
		draft.categories = state.categories.filter(category => categoryId !== category.id)
	}));

	return {
		subscribe,
		upload,
		addIngredient,
		addCondition,
		addCategory,
		updateIngredient,
		updateCondition,
		updateCategory,
		removeIngredient,
		removeCondition,
		removeCategory
	};
};

export const store = createStore();

store.subscribe(state => localStorage.setItem("store", JSON.stringify(state)));
