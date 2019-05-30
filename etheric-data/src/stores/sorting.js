import { writable } from 'svelte/store';
import { produce } from "immer";

const initialState = {
	ingredients: {
		column: "swedish",
		ascending: true
	},
	conditions: {
		column: "swedish",
		ascending: true
	},
	categories: {
		column: "swedish",
		ascending: true
	}
};

const createSorting = () => {
	const { subscribe, update } = writable(initialState);

	const change = (type, column) => update(state => produce(state, draft => {
		if (!type || !column) {
			return;
		}

		const currentColumn = state[type].column;
		const currentAscending = state[type].ascending;

		draft[type] = {
			column,
			ascending: column === currentColumn ? !currentAscending : true
		}
	}));

	return {
		subscribe,
		change
	};
}

export const sorting = createSorting();
