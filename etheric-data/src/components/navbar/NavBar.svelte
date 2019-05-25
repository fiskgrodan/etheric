<nav>
	<div class="link-container">
		<a href="#ingredients">Ingredienser</a>
		<a href="#conditions">Tillstånd</a>
		<a href="#categories">Kategorier</a>
	</div>
</nav>

<style>
	nav {
		display: flex;
		justify-content: center;
		position: fixed;
		top: 0;
		height: 48px;
		width: 100%;
		background-color: #1e87f0;
	}

	.link-container {
		display: flex;
		align-items: center;
		height: 100%;
		width: 600px;
	}
	
	a {
		display: flex;
		align-items: center;
		height: 100%;
		margin-right: 32px;
		color: #ffffff;
		transition: color 150ms ease-out 0ms;
		user-select: none;
		text-decoration: none;
	}
	a:hover {
		cursor: pointer;
		color: #cce5ff;
	}
</style>