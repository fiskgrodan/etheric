<nav>
	<div class="link-container">
		<a class="link" href="#ingredients">Ingredienser</a>
		<a class="link" href="#conditions">Tillstånd</a>
		<a class="link" href="#categories">Kategorier</a>
		<div class="button-container">
			<a class="icon-button-wrapper" download="etheric-data.json" href={downloadHref}>
				<Download />
			</a>
			<div class="icon-button-wrapper">
				<label>
					<Upload />
					<input type="file" accepts=".json" style="display: none;" on:change={upload}>
				</label>
			</div>
		</div>
	</div>
</nav>

<script>
	import Download from "../icons/Download.svelte";
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

	$: downloadHref = `data:text/json;charset=utf-8,${JSON.stringify({
		ingredients: $store.ingredients,
		conditions: $store.conditions,
		categories: $store.categories,
	}, null, 2)}`
</script>

<style>
	nav {
		display: flex;
		justify-content: center;
		position: fixed;
		top: 0;
		height: 48px;
		width: 100%;
		background-color: #1e87f0;
		z-index: 100;
	}

	.link-container {
		display: flex;
		align-items: center;
		height: 100%;
		width: 600px;
	}

	.link {
		display: flex;
		align-items: center;
		height: 100%;
		margin-right: 32px;
		color: #ffffff;
		transition: color 150ms ease-in-out 0ms;
		user-select: none;
		text-decoration: none;
	}

	.link:hover {
		cursor: pointer;
		color: #cce5ff;
	}

	.button-container {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex-grow: 1;
		height: 100%;
	}

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