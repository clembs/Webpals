<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { Connection } from '$lib/db/types';
	import {
		ArrowSquareOut,
		Check,
		CopySimple,
		PencilSimple,
		TextAlignLeft,
		TrashSimple
	} from 'phosphor-svelte';
	import { connectionProviders } from './connection-providers';
	import { SvelteSet } from 'svelte/reactivity';
	import { enhance } from '$app/forms';
	import { dialogPortal } from '$lib/components/Dialog/dialog.svelte';
	import EditDialog from './EditDialog.svelte';

	let {
		isEditing,
		connection
	}: {
		isEditing: boolean;
		connection: Connection;
	} = $props();

	let provider = $derived(connectionProviders.find(({ id }) => id === connection.provider)!);

	// to more quickly delete a connection
	let isPressingShift = $state(false);

	// store a list of copying connections for the icon to change
	let copiedConnections = new SvelteSet<string>();

	function copyIdentifiable() {
		navigator.clipboard.writeText(connection.identifiable);
		copiedConnections.add(connection.id);
		setTimeout(() => copiedConnections.delete(connection.id), 1000);
	}
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Shift') {
			isPressingShift = true;
		}
	}}
	onkeyup={(e) => {
		if (e.key === 'Shift') {
			isPressingShift = false;
		}
	}}
/>

{#snippet leading()}
	<div class="leading">
		{#if provider}
			<provider.icon {...provider.iconProps} />
		{:else}
			<TextAlignLeft />
		{/if}

		<div class="text">
			{#if connection.label}
				<div class="clickable">
					{connection.label}
				</div>
				<div class="paragraph">
					{connection.identifiable}
				</div>
			{:else}
				<div class="clickable">
					{connection.identifiable}
				</div>
			{/if}
		</div>
	</div>
{/snippet}

{#snippet content()}
	{@render leading()}

	<div class="trailing">
		{#if connection.url}
			<ArrowSquareOut weight="regular" />
		{:else}
			<div class="copy-icon" class:animate={copiedConnections.has(connection.id)}>
				{#if copiedConnections.has(connection.id)}
					<Check weight="regular" />
				{:else}
					<CopySimple weight="regular" />
				{/if}
			</div>
		{/if}
	</div>
{/snippet}

{#if isEditing}
	<div class="connection" data-editing="true" data-has-label={!!connection.label}>
		{@render leading()}

		<div class="trailing">
			<!-- TODO: add connection editing back -->
			<Button
				variant="text"
				icon={PencilSimple}
				onclick={() => dialogPortal.openDialog(editDialog)}
				aria-label="Edit connection"
				title="Edit connection"
			/>
			<form
				use:enhance={({ cancel }) => {
					if (!isPressingShift) {
						dialogPortal.openDialog(confirmDeleteDialog);
						cancel();
					}
				}}
				action="/api/profile?/deleteConnection&connection-id={connection.id}"
				method="post"
			>
				<Button
					variant={isPressingShift ? 'urgent' : 'text'}
					icon={TrashSimple}
					aria-label="Delete connection"
					title="Delete connection"
					type="submit"
				/>
			</form>
		</div>
	</div>
{:else if connection.url}
	<a
		class="connection"
		data-has-label={!!connection.label}
		href={connection.url}
		target="_blank"
		rel="noopener noreferrer"
	>
		{@render content()}
	</a>
{:else}
	<button
		class="connection"
		data-has-label={!!connection.label}
		type="button"
		onclick={copyIdentifiable}
	>
		{@render content()}
	</button>
{/if}

{#snippet editDialog()}
	<EditDialog {connection} {provider} />
{/snippet}

{#snippet confirmDeleteDialog()}
	<form
		class="confirm-delete"
		use:enhance={() => dialogPortal.closeDialog()}
		method="post"
		action="/api/profile?/deleteConnection&connection-id={connection.id}"
	>
		<h1>Delete connection?</h1>

		<p>
			Are you sure you want to delete this connection? If it was verified, you will have to
			re-verify it. This action cannot be undone.
		</p>

		<p class="footnote">
			Pro tip: On the connections list, hold Shift while clicking the delete button to skip this
			dialog.
		</p>

		<div class="buttons">
			<Button
				aria-label="Delete connection"
				variant="secondary"
				onclick={() => dialogPortal.closeDialog()}
			>
				Cancel
			</Button>

			<Button aria-label="Delete connection" variant="urgent" type="submit">
				Delete connection
			</Button>
		</div>
	</form>
{/snippet}

<style lang="scss">
	.connection {
		display: flex;
		justify-content: space-between;
		align-items: center;

		padding: var(--base-padding) calc(var(--base-padding) * 0.75);
		gap: var(--base-gap);
		width: 100%;

		border: none;
		background-color: transparent;
		color: var(--color-heading);
		text-align: left;

		cursor: pointer;

		// Since when editing we have buttons which are bigger than the icon size,
		// the height of the connection would be inconsistent between editing/viewing states
		// so we force a height that's padding * 2 + icon size
		&[data-has-label='false'] {
			height: calc(var(--base-padding) * 2 + 24px);
		}
		// same deal here, expect it's
		// padding * 2 + text height * 2 (1rem is 24px tall) + gap between the label & identifiable
		&[data-has-label='true'] {
			height: calc(var(--base-padding) * 2 + 48px + var(--base-gap) * 0.25);
		}

		// When editing, reduce the right padding so it *looks* aligned
		&[data-editing='true'] {
			padding-right: calc(var(--base-padding) * 0.375);
		}

		.leading {
			display: flex;
			align-items: center;

			gap: calc(var(--base-gap) * 0.75);

			.text {
				display: flex;
				flex-direction: column;
				gap: calc(var(--base-gap) * 0.25);
			}
		}

		&:is(button, a):hover {
			backdrop-filter: brightness(0.95);
		}

		&:hover:active .copy-icon {
			transform: scale(0.95);
		}

		.copy-icon {
			display: grid;
			place-items: center;
			transition: transform 200ms;

			&.animate {
				transform: scale(1.15);
			}
		}

		form {
			display: contents;
		}
	}
</style>
