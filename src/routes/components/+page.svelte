<script lang="ts">
	import type { Component } from 'svelte';
	import Buttons from './Buttons.svelte';
	import Typography from './Typography.svelte';

	const components: Record<string, Component> = { Buttons, Typography };

	let selected = $state(Object.keys(components)[0]);
	let CurrentComponent = $derived(components[selected]);
</script>

<main>
	<select bind:value={selected}>
		{#each Object.keys(components) as component}
			<option value={component}>{component}</option>
		{/each}
	</select>

	<div class="current-component-wrapper">
		<CurrentComponent />
	</div>
</main>

<style lang="scss">
	main {
		margin: var(--base-gap);
	}

	select {
		padding: 1rem;
		width: 100%;
		margin-bottom: 1rem;
	}

	.current-component-wrapper {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 1.25);

		:global {
			section h3 {
				margin-bottom: calc(var(--base-padding) * 0.5);
			}

			.flex {
				display: flex;
				gap: calc(var(--base-gap) * 0.5);
				align-items: center;
			}
		}
	}
</style>
