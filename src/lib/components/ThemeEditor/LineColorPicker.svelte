<script lang="ts">
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
	import UndoPropButton from './UndoPropButton.svelte';
	import Button from '../Button.svelte';
	import { Check, Copy } from 'phosphor-svelte';

	let {
		label,
		name,
		value = $bindable(),
		initialValue
	}: {
		label: string;
		name: string;
		value: string;
		initialValue: string;
	} = $props();

	let isCopying = $state(false);

	function copyToClipboard() {
		isCopying = true;
		navigator.clipboard.writeText(value);
		setTimeout(() => (isCopying = false), 1000);
	}
</script>

<div class="line-color-picker">
	<ColorPicker
		components={ChromeVariant}
		sliderDirection="horizontal"
		{label}
		{name}
		bind:hex={value}
	/>

	<div class="buttons">
		<Button
			icon
			inline
			size="small"
			variant="link"
			aria-label="Copy value"
			onclick={copyToClipboard}
		>
			{#if isCopying}
				<Check size={18} weight="regular" />
			{:else}
				<Copy size={18} weight="regular" />
			{/if}
		</Button>

		{#if value !== initialValue}
			<UndoPropButton bind:value {initialValue} />
		{/if}
	</div>
</div>

<style lang="scss">
	.line-color-picker {
		display: flex;
		align-items: center;
		gap: calc(var(--base-gap) * 0.5);

		:global(.color-picker label) {
			gap: calc(var(--base-gap) * 0.75);
			margin: 0;
		}

		:global(.color-picker .color) {
			border: var(--inputs-border-width) solid var(--inputs-border-color);
		}

		.buttons {
			display: flex;
		}
	}
</style>
