<button on:click>
	<slot></slot>
</button>

<style>
	button {
		background-color: #1e87f0;
		color: #fff;
		margin: 0;
		border: none;
		overflow: visible;
		font: inherit;
		display: inline-block;
		box-sizing: border-box;
		padding: 0 30px;
		vertical-align: middle;
		font-size: 14px;
		line-height: 38px;
		text-align: center;
		text-decoration: none;
		text-transform: uppercase;
		transition: .1s ease-in-out;
		transition-property: color, background-color, border-color;
		outline: 0;
	}

	button:hover {
		background-color: #0f7ae5;
		color: #fff;
		cursor: pointer;
	}
</style>