<select bind:value={selected} on:change={event => onChange(event.target.value)}>
	<option disabled selected value="">Lägg till</option>
	{#each options as option}
		<option value={option.id}>{option.swedish}</option>
	{/each}
</select>

<script>
	export let options = [];
	export let select = () => {};

	let selected = "";

	const onChange = (value) => {
		selected = "";
		select(Number(value))
	}
</script>

<style>
	select {
		width: 100%;
		padding: 6 12px;
		border: 1px solid #e5e5e5;
    transition: .2s ease-in-out;
    transition-property: color, background-color, border;
		border-radius: 4px;
		text-transform: none;
		height: 24px;
	}
</style>