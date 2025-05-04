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
	import { PencilSimple, TrashSimple } from 'phosphor-svelte';
	import Button from '$lib/components/Button.svelte';
	import { dialogPortal } from '$lib/portals/dialog.svelte';
	import { fly } from 'svelte/transition';

	let {
		editingMode,
		widget,
		editMenu,
		children
	}: {
		editingMode?: boolean;
		widget?: AnyWidgetJSON;
		editMenu?: Snippet;
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
		<h2>Are you sure you want to delete this widget?</h2>

		<p>
			Contents of the widget will be lost. You can bring it back with the + menu, but it will be
			blank.
		</p>

		<div class="buttons">
			<Button type="button" variant="secondary" onclick={() => dialogPortal.closeDialog()}>
				Cancel
			</Button>
			<Button type="submit" variant="urgent">Delete widget</Button>
		</div>
	</form>
{/snippet}

<div class="widget-wrapper" bind:this={wrapperEl}>
	{#if editingMode}
		<div class="hover-menu" transition:fly={{ duration: 150, y: -10 }}>
			{#if editMenu}
				<button aria-label="Edit widget" onclick={() => dialogPortal.openDialog(editMenu)}>
					<PencilSimple size={20} />
				</button>
			{/if}
			{#if widget}
				<!-- if the menu is editable, open the dialog to confirm deletion -->
				{#if editMenu}
					<button
						onclick={() => dialogPortal.openDialog(confirmDeleteDialog)}
						aria-label="Delete widget"
					>
						<TrashSimple size={20} />
					</button>
					<!-- otherwise we dont really care and can delete right away -->
				{:else}
					<form use:enhance action="/api/profile?/deleteWidget&id={widget.id}" method="post">
						<button aria-label="Delete widget">
							<TrashSimple size={20} />
						</button>
					</form>
				{/if}
			{/if}
		</div>
	{/if}

	<div class="inner-widget" inert={editingMode}>
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

			button {
				border: none;
				border: var(--inputs-border-width) solid var(--inputs-border-color);
				background: var(--widgets-background-color-dim);
				padding: calc(var(--base-padding) * 0.375);
				color: var(--inputs-on-background-color);
				cursor: pointer;

				&:first-child {
					border-radius: var(--inputs-border-base-radius) 0 0 var(--inputs-border-base-radius);
					border-right: none;
				}

				&:last-child {
					border-radius: 0 var(--inputs-border-base-radius) var(--inputs-border-base-radius) 0;
				}

				&:first-child:last-child {
					border-radius: var(--inputs-border-base-radius);
					border-right: var(--inputs-border-width) solid var(--inputs-border-color);
				}

				&:hover,
				&:focus-within {
					filter: brightness(0.9);
				}
			}
		}

		.inner-widget {
			@include mixins.card;
		}
	}
</style>
