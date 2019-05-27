<div class="wrapper">
	<form on:submit|preventDefault={onSubmit}>
		<Container noHover>
			<div class="row">
				<div class="input-wrapper">
					<Input bind:value={swedish} placeholder="Svenska" block />
				</div>
				<div class="input-wrapper">
					<Input bind:value={english} placeholder="Engelska" block />
				</div>
				<div class="button-wrapper">
					<CreateButton enabled={enabled} on:click={onSubmit} />
				</div>
			</div>
		</Container>
	</form>
</div>

<script>
	import Container from "../Container.svelte";
	import Input from "../../form/Input.svelte";
	import CreateButton from "./CreateButton.svelte";
	import { store } from "../../../stores/store.js";

	export let add;

	let swedish = "";
	let english = "";

	$: enabled = swedish !== "" && english !== "";

	const onSubmit = () => {
		if (!enabled) {
			return;
		}
		add(swedish, english);
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