<button class="{type}" on:click>
	<slot />
</button>

<script>
	export let type = "default";
</script>

<style>
	button {
		padding: 8px 16px;
		margin: 0;
		outline: none;
		user-select: none;
    border: none;
		letter-spacing: 1px;
		border-radius: 3px;
		transition: background-color 150ms ease-in-out 0ms;
	}

	button:hover {
		cursor: pointer;
	}

	.default {
		color: #666666;
		background-color: #ffffff;
	}
	.default:hover {
		background-color: #efefef;
	}

	.primary {
		color: #ffffff;
		background-color:  var(--primary-color);
	}
	.primary:hover {
		background-color: var(--primary-dark-color);
	}

	.secondary {
		color: #ffffff;
		background-color:  var(--secondary-color);
	}
	.secondary:hover {
		background-color: var(--secondary-dark-color);
	}
</style>