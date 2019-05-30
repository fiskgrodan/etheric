{#if open}
<div class="wrapper" transition:fade>
	<div class="background" on:click={() => close()} />
	<div class="modal {size}" transition:fly="{{ y: -80 }}">
		<div class="title-row">
			<div class="title">{title}</div>
			<div class="close" on:click={() => close()}>
				<Remove />
			</div> 
		</div>
		<div class="body">
			<slot name="body" />
		</div>
		<div class="footer">
			<slot name="footer" />
		</div>
	</div>
</div>
{/if}

<script>
	import { fade, fly } from 'svelte/transition';
	import Remove from '../icons/Remove.svelte';

	export let open;
	export let close;
	export let title = "";
	export let size = "normal"
</script>

<style>
	.wrapper {
		width: 100%;
		height: 100%;
	}

	.background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 50;
	}

	.modal {
		position: fixed;
		top: 160px;
		padding: 20px;
		border-radius: 4px;
		background: white;
		left: 50%;
		z-index: 60;
	}

	.normal {
		width: 560px;
		margin-left: -300px;
	}

	.small {
		width: 320px;
		margin-left: -180px;
	}

	.title-row {
		display: flex;
		align-items: center;
	}

	.title {
		flex-grow: 1;
		font-size: 18px;
		color: #333333;
	}

	.close {
		color: #999999;
		transition: color 150ms ease-in-out 0ms;
	}
	.close:hover {
		cursor: pointer;
		color: #666666;
	}

	.body {
		padding-top: 20px;
		padding-bottom: 20px;
	}

	.footer {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
</style>