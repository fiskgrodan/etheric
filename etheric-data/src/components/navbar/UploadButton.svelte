<div class="icon-button-wrapper">
	<label>
		<Upload />
		<input type="file" accept=".json" style="display: none;" on:change={upload}>
	</label>
</div>

<script>
	import Upload from "../icons/Upload.svelte";
	import { store } from "../../stores/store.js";

	const upload = event => {
		const file = event.target && event.target.files && event.target.files[0];
		if (file) {
			const reader = new FileReader()
			reader.onload = readerEvent => {
				store.upload(JSON.parse(readerEvent.target.result));
			}
			reader.readAsText(file)
		}
	};
</script>

<style>
	.icon-button-wrapper {
		color: #ffffff;
		transition: color 150ms ease-in-out 0ms;
		line-height: 1;
		margin-left: 32px;
		user-select: none;
		text-decoration: none;
	}

	.icon-button-wrapper:hover {
		cursor: pointer;
		color: #cce5ff;
	}

	label:hover {
		cursor: pointer;
	}
</style>