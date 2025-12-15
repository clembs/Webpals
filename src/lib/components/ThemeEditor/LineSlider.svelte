<script lang="ts">
	import Slider from '../Slider.svelte';
	import UndoPropButton from './UndoPropButton.svelte';

	let {
		label,
		name,
		min = 0,
		max = 100,
		step = 1,
		value = $bindable(),
		initialValue
	}: {
		label: string;
		name: string;
		min?: number;
		max?: number;
		step?: number;
		value: number;
		initialValue: number;
	} = $props();
</script>

<div class="line-slider">
	<div class="label">
		{#if label}
			<label for={name}>{label}</label>
		{/if}

		<div class="buttons">
			{#if value !== initialValue}
				<UndoPropButton bind:value {initialValue} />
			{/if}
		</div>
	</div>

	<Slider {name} {min} {max} {step} bind:value />
</div>

<style lang="scss">
	.line-slider {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 0.5);
		flex: 1;

		.label {
			display: flex;
			align-items: center;
			gap: calc(var(--base-gap) * 0.75);
		}

		.buttons {
			margin: calc(0px - var(--base-padding) * 0.5);
		}
	}
</style>
