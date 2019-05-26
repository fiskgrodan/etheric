<div>
	<input bind:value type="text" placeholder={placeholder} class:block={block}>
</div>

<script>
	export let block = false;
	export let placeholder;
	export let value;
</script>

<style>
	div {
		padding-right: 12px;
	}

	input {
		font-size: 16px;
		outline: 0;
		border-width: 0 0 2px;
		border-color: #eeeeee;
		transition: border-color 150ms ease-in-out 0ms;
		color: #666666;
	}

	input:focus {
		border-color: var(--primary-color);
	}

	input::placeholder {
		color: #999999;
	}

	input.block {
		width: 100%;
	}
</style>