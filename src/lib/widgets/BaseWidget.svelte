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
	import { type Component, type Snippet } from 'svelte';
	import { enhance } from '$app/forms';
	import { GearSix, TrashSimple, type IconComponentProps } from 'phosphor-svelte';
	import Button from '$lib/components/Button.svelte';
	import { dialogPortal } from '$lib/components/Dialog/dialog.svelte';

	let {
		isEditing,
		widget,
		settingsIcon,
		settingsIconProps,
		settingsDialog,
		children
	}: {
		isEditing?: boolean;
		widget?: AnyWidgetJSON;
		settingsIcon?: Component<IconComponentProps>;
		settingsIconProps?: IconComponentProps;
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
			<Button variant="secondary" onclick={() => dialogPortal.closeDialog()}>Cancel</Button>
			<Button type="submit" variant="urgent">Delete widget</Button>
		</div>
	</form>
{/snippet}

<div class="widget-wrapper" bind:this={wrapperEl}>
	<div class="inner-widget">
		{@render children()}
	</div>

	{#if isEditing}
		<div class="hover-menu">
			{#if settingsDialog}
				<Button
					icon={settingsIcon ?? GearSix}
					iconProps={settingsIconProps}
					size="sm"
					aria-label="Open widget settings"
					onclick={() => dialogPortal.openDialog(settingsDialog)}
				/>
			{/if}
			{#if widget}
				<Button
					icon={TrashSimple}
					size="sm"
					aria-label="Delete widget"
					onclick={() => dialogPortal.openDialog(confirmDeleteDialog)}
				/>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	@use '../../styles/mixins.scss';

	.widget-wrapper {
		position: relative;

		.hover-menu {
			display: flex;
			position: absolute;
			top: calc(var(--base-padding) * 0.25);
			right: calc(var(--base-padding) * 0.25);

			gap: calc(var(--base-gap) * 0.25);
			padding: calc(var(--base-padding) * 0.25);
		}

		.inner-widget {
			@include mixins.card;
		}
	}
</style>
