<svelte:window on:keydown={handleKeyDown} />

<div>
	<input bind:this={input} bind:value type="text" placeholder={placeholder} class:block={block}>
</div>

<script>
	export let block = false;
	export let placeholder;
	export let value;
	let input;

	const handleKeyDown = event => {
		if (event.key === "Enter" || event.key === "Escape") {
			setTimeout(() => input.blur(), 0);
		}
	};
</script>

<style>
	div {
		padding-right: 12px;
	}

	input {
		font-size: 14px;
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
		color: #dddddd;
	}

	input.block {
		width: 100%;
	}
</style>