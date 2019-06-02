import { writable, derived } from 'svelte/store';
import clone from 'just-clone';
import { produce } from "immer";
import { store } from "../../stores/store.js";

const createEditCategory = () => {
	const { subscribe, set, update } = writable(null);

	const setEditCategory = newEditCategory => set(clone(newEditCategory));

	const addCondition = addConditionId => update(state => produce(state, draft => {
		draft.conditions.push(addConditionId);
	}));

	const removeCondition = removeConditionId => update(state => produce(state, draft => {
		draft.conditions = state.conditions.filter(conditionId => conditionId !== removeConditionId);
	}));

	const clear = () => set(null);

	return {
		subscribe,
		set: setEditCategory,
		clear,
		addCondition,
		removeCondition
	};
}

export const editCategory = createEditCategory();

export const isOpen = derived(editCategory, $editCategory => $editCategory !== null);

const sortConditions = (a, b) => {
	if (a.swedish > b.swedish) {
		return 1;
	}
	if (a.swedish < b.swedish) {
		return -1;
	}
	return 0;
};

export const selectableConditions = derived([store, editCategory], ([$store, $editCategory]) => {
	if ($editCategory === null) {
		return [];
	}

	return $store.conditions
		.filter(condition => !$editCategory.conditions.includes(condition.id))
		.sort(sortConditions);
});

export const sortedConditions = derived([store, editCategory], ([$store, $editCategory]) => {
	if ($editCategory === null) {
		return [];
	}

	return $store.conditions
		.filter(condition => $editCategory.conditions.includes(condition.id))
		.sort(sortConditions);
});
