<script>
	import { hash } from "../stores/hash.js";
	import { media } from "../stores/media.js";
</script>

<style>
	:global(body) {
		font-family: Arial;
		margin: 0;
		padding: 0;
	}

	h1 {
		color: crimson;
	}
</style>

<h1>Hello {$hash}!</h1>
<h1>Is mobile: {$media}</h1>
