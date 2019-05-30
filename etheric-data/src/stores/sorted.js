import { derived } from "svelte/store";
import { produce } from "immer";
import { store } from "./store.js";
import { sorting } from "./sorting.js";

const sortItems = (items, column, ascending) => produce(items, draft => {
	draft.sort((a, b) => {
		if (a[column] < b[column]) {
			return ascending ? -1 : 1;
		}
		if (a[column] > b[column]) {
			return ascending ? 1 : -1;
		}
		return 0;
	});
});


export const sorted = derived(
	[store, sorting],
	([$store, $sorting]) => ({
		ingredients: sortItems(
			$store.ingredients,
			$sorting.ingredients.column,
			$sorting.ingredients.ascending
		),
		conditions: sortItems(
			$store.conditions,
			$sorting.conditions.column,
			$sorting.conditions.ascending
		),
		categories: sortItems(
			$store.categories,
			$sorting.categories.column,
			$sorting.categories.ascending
		)
	})
);
