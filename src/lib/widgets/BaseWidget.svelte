<script lang="ts" module>
	// thanks a LOT to @paolo.ricciuti.me for their help with figuring out this!!
	// https://bsky.app/profile/paolo.ricciuti.me/post/3lehtcrthvc2i
	let isAnyWidgetEditing = $state({
		value: false
	});

	export { isAnyWidgetEditing };
</script>

<script lang="ts">
	import type { AnyWidgetJSON } from '$lib/widgets/types';
	import { type Snippet } from 'svelte';
	import { enhance } from '$app/forms';
	import { GearSix, TrashSimple } from 'phosphor-svelte';
	import Button from '$lib/components/Button.svelte';
	import { dialogPortal } from '$lib/components/Dialog/dialog.svelte';

	let {
		editing,
		widget,
		settingsDialog,
		children
	}: {
		editing?: boolean;
		widget?: AnyWidgetJSON;
		settingsDialog?: Snippet;
		children: Snippet;
	} = $props();

	let wrapperEl = $state<HTMLDivElement>();
</script>

{#snippet confirmDeleteDialog()}
	<form
		use:enhance={() =>
			({ update }) => {
				dialogPortal.closeDialog();
				update();
			}}
		action="/api/profile?/deleteWidget&id={widget!.id}"
		method="post"
		class="confirm-delete"
	>
		<h1>Delete this widget?</h1>

		<p>Any settings to this widget will be lost if you change your mind and add it again later.</p>

		<div class="buttons">
			<Button type="button" variant="secondary" onclick={() => dialogPortal.closeDialog()}>
				Cancel
			</Button>
			<Button type="submit" variant="urgent">Delete widget</Button>
		</div>
	</form>
{/snippet}

<div class="widget-wrapper" bind:this={wrapperEl}>
	{#if editing}
		<div class="hover-menu">
			{#if settingsDialog}
				<Button
					icon={GearSix}
					size="sm"
					aria-label="Open widget settings"
					onclick={() => dialogPortal.openDialog(settingsDialog)}
				/>
			{/if}
			{#if widget}
				<!-- if the menu is editable, open the dialog to confirm deletion -->
				<!-- {#if editMenu} -->
				<Button
					icon={TrashSimple}
					size="sm"
					aria-label="Delete widget"
					onclick={() => dialogPortal.openDialog(confirmDeleteDialog)}
				/>
				<!-- otherwise we dont really care and can delete right away -->
				<!-- {:else}
					<form use:enhance action="/api/profile?/deleteWidget&id={widget.id}" method="post">
						<button aria-label="Delete widget">
							<TrashSimple size={20} />
						</button>
					</form>
				{/if} -->
			{/if}
		</div>
	{/if}

	<div class="inner-widget">
		{@render children()}
	</div>
</div>

<style lang="scss">
	@use '../../styles/mixins.scss';

	.widget-wrapper {
		position: relative;

		.hover-menu {
			display: flex;
			position: absolute;
			right: calc(var(--base-padding) * 0.25);
			top: calc(var(--base-padding) * 0.25);
			padding: calc(var(--base-padding) * 0.25);
			z-index: 2;
		}

		.inner-widget {
			@include mixins.card;
		}
	}
</style>
