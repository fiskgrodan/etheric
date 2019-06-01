<Modal open={open} close={close} title={title}>
	<div slot="body">
		<div class="row">
			<div class="language-header">Svenska</div>
			<div class="language-header">Engelska</div>
		</div>
		<div class="row">
			<div class="input-wrapper">
				<Input bind:value={item.swedish} placeholder="Svenska" block />
			</div>
			<div class="input-wrapper">
				<Input bind:value={item.english} placeholder="Engelska" block />
			</div>
		</div>
		<slot />
	</div>
	<div slot="footer">
		<Button type="default" on:click={()=> close()}>Avbryt</Button>
		<Button type="primary" on:click={()=> update(item)}>Spara</Button>
	</div>
</Modal>

<script>
	import Modal from "./Modal.svelte";
	import Button from "../buttons/Button.svelte";
	import Input from "../form/Input.svelte";

	export let item;
	export let open;
	export let close;
	export let update;
	export let title;
</script>

<style>
	.row {
		display: flex;
		width: 100%;
		margin-bottom: 4px;
	}

	.language-header {
		flex-grow: 1;
		font-size: 12px;
	}

	.input-wrapper {
		flex-grow: 1;
		padding-right: 6px
	}
</style>