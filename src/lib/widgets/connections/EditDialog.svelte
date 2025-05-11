<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { dialogPortal } from '$lib/components/Dialog/dialog.svelte';
	import { toaster } from '$lib/components/Toast/toast.svelte';
	import type { Connection } from '$lib/db/types';
	import type { ConnectionProviderData } from './connection-providers';
	import DetailsForm from './DetailsForm.svelte';

	let {
		connection,
		provider
	}: {
		connection: Connection;
		provider: ConnectionProviderData;
	} = $props();

	// form stuff
	let label = $state(connection.label || '');
	let identifiable = $state(connection.identifiable);

	let isLoading = $state(false);

	// animation-related stuff (stolen from CreateDialog.sveltre)
	let editDialogEl = $state<HTMLElement>();

	// function recalculateDialogHeight() {
	// 	requestAnimationFrame(() => {
	// 		const currentStepEl = editDialogEl!.children[0];
	// 		editDialogEl!.style.height = `${currentStepEl.clientHeight}px`;
	// 	});
	// }
</script>

<form
	id="connection-create-dialog"
	use:enhance={() => {
		isLoading = true;

		return async ({ result, update }) => {
			isLoading = false;

			if (
				result.type === 'failure' &&
				result.data?.message &&
				typeof result.data.message === 'string'
			) {
				toaster.error('An error occured while editing this connection.');
			} else if (result.type === 'success') {
				toaster.success('Connection successfully edited!');
				dialogPortal.closeDialog();
			}

			await update({
				invalidateAll: true,
				reset: false
			});
		};
	}}
	action="/api/profile?/editConnection&connection-id={connection.id}"
	method="post"
	bind:this={editDialogEl}
>
	<h1>Edit Connection</h1>

	<DetailsForm bind:label bind:identifiable {provider} />

	<div class="buttons">
		<Button
			type="submit"
			loading={isLoading}
			disabled={isLoading || !identifiable || !provider?.identifiablePattern?.test(identifiable)}
		>
			Edit
		</Button>
	</div>
</form>

<style lang="scss">
	form {
		min-width: 500px;

		@media (max-width: 768px) {
			min-width: 0px;
		}
	}
</style>
