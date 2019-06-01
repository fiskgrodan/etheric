<Modal open={open} close={close} title={title} size="small">
	<div slot="body">
		<slot />
	</div>
	<div slot="footer">
		<Button type="default" on:click={() => close()}>Avbryt</Button>
		<Button type="secondary" on:click={() => remove(itemId)}>Ta bort</Button>
	</div>
</Modal>

<script>
	import Modal from "./Modal.svelte";
	import Button from "../buttons/Button.svelte";

	export let itemId = null;
	export let open;
	export let close;
	export let remove;
	export let title;
</script>