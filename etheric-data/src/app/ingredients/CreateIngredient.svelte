<div class="wrapper">
	<form on:submit|preventDefault={addIngredient}>
		<Container noHover>
			<div class="row">
				<div class="input-wrapper">
					<Input bind:value={swedish} placeholder="Svenska" block />
				</div>
				<div class="input-wrapper">
					<Input bind:value={english} placeholder="Engelska" block />
				</div>
				<div class="button-wrapper">
					<CreateIngredientButton enabled={enabled} on:click={addIngredient} />
				</div>
			</div>
		</Container>
	</form>
</div>

<script>
	import Container from "../../components/content/Container.svelte";
	import ContentHeader from "../../components/content/ContentHeader.svelte";
	import Input from "../../components/form/Input.svelte";
	import CreateIngredientButton from "./CreateIngredientButton.svelte";
	import { store } from "../../stores/store.js";

	let swedish = "";
	let english = "";

	$: enabled = swedish !== "" && english !== "";

	const addIngredient = () => {
		if (!enabled) {
			return;
		}
		store.addIngredient(swedish, english);
		swedish = "";
		english = "";
	}
</script>

<style>
	.wrapper {
		margin-top: 24px;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		height: 24px;
		width: 100%;
	}

	.input-wrapper {
		width: 250px;
		padding-right: 10px
	}

	.button-wrapper {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex-grow: 1;
		padding-right: 4px;
	}
</style>