<UpdateModal 
	item={editCondition} 
	open={editOpen} 
	close={()=> close()}
	update={item => {
		store.updateCondition(item);
		editCondition = null;
	}}
	title="Ändra tillstånd"
>
	<div class="container">
		<div class="row">
			<div class="header">Bas</div>
			<div class="header">Mellan</div>
			<div class="header">Topp</div>
		</div>
	</div>
</UpdateModal>

<script>
	import UpdateModal from "../../components/modal/UpdateModal.svelte";
	import { store } from "../../stores/store.js";

	export let editCondition = null;
	export let close;

	$: editOpen = editCondition !== null;
</script>

<style>
	.container {
		padding-top: 20px;
		padding-bottom: 10px;
	}

	.row {
		display: flex;
		width: 100%;
		margin-bottom: 4px;
	}

	.header {
		flex-grow: 1;
		font-size: 12px;
	}
</style>