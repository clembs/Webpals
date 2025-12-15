<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { dialogPortal } from '$lib/components/Dialog/dialog.svelte';
	import { WarningOctagon } from 'phosphor-svelte';
	import type { Snippet } from 'svelte';

	let {
		settingsDialog
	}: {
		settingsDialog: Snippet;
	} = $props();
</script>

<div class="no-content">
	<div class="header">
		<WarningOctagon />
		<h4>This widget is empty!</h4>
	</div>

	<p>It won't be displayed on your profile. Open the widget's settings to get started.</p>

	<Button onclick={() => dialogPortal.openDialog(settingsDialog)}>Open Widget Settings</Button>
</div>

<style lang="scss">
	.no-content {
		display: flex;
		flex-direction: column;

		padding: var(--base-padding);
		gap: var(--base-gap);

		background-color: var(--color-warning);
		color: var(--color-heading);
		border-radius: calc(var(--widgets-border-base-radius) - var(--base-padding));

		.header {
			display: flex;
			gap: calc(var(--base-gap) * 0.5);
		}

		p {
			color: var(--color-heading);
		}
	}
</style>
