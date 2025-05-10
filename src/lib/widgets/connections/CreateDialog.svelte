<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { dialogPortal } from '$lib/components/Dialog/dialog.svelte';
	import { ArrowLeft, CaretRight, MagnifyingGlass } from 'phosphor-svelte';
	import { connectionProviders, type ConnectionProviderData } from './connection-providers';
	import TextInput from '$lib/components/TextInput.svelte';
	import { enhance } from '$app/forms';
	import RowItem from '$lib/components/RowItem.svelte';
	import ConnectionComponent from './ConnectionComponent.svelte';
	import { toaster } from '$lib/components/Toast/toast.svelte';
	import { parseIdentifiableUrl } from './helpers';

	// form stuff
	let label = $state('');
	let identifiable = $state('');
	let selectedProvider = $state<ConnectionProviderData>();

	// provider filtering
	let filter = $state('');
	let filteredProviders = $derived(
		connectionProviders
			.sort((a, b) => a.name.localeCompare(b.name))
			.filter(
				({ name, id }) =>
					name.toLowerCase().includes(filter.toLowerCase()) || id.includes(filter.toLowerCase())
			)
	);

	// steps
	const stepWidth = 550;
	let currentStep = $state(0);
	let createDialogEl = $state<HTMLElement>();

	let isLoading = $state(false);

	function nextStep() {
		currentStep++;
		moveSteps();
	}

	function previousStep() {
		currentStep--;
		moveSteps();
	}

	function moveSteps() {
		createDialogEl!.scroll({
			left: stepWidth * currentStep,
			behavior: 'smooth'
		});

		createDialogEl!.style.height = `${createDialogEl!.clientHeight}px`;
		recalculateDialogHeight();
	}

	// smoothly animate the height of the dialog
	function recalculateDialogHeight() {
		requestAnimationFrame(() => {
			const currentStepEl = createDialogEl!.children[currentStep];
			createDialogEl!.style.height = `${currentStepEl.clientHeight}px`;
		});
	}

	// $effect(() => {
	// 	// when the dialog closes, remove the selectedProvider value
	// 	if (!dialogPortal.current) {
	// 		selectedProvider = undefined;
	// 	}
	// });
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
				toaster.error('An error occured while adding this connection.');
				// TODO: toast
			} else if (result.type === 'success') {
				toaster.success('Connection successfully added!');
				dialogPortal.closeDialog();
			}

			await update({
				invalidateAll: true,
				reset: false
			});
		};
	}}
	action="/api/profile?/createConnection"
	method="post"
	style:--step-width="{stepWidth}px"
	bind:this={createDialogEl}
>
	<div class="step" inert={currentStep !== 0}>
		<h1>Add a Connection</h1>

		<input name="connection-provider" type="hidden" value={selectedProvider?.id} />

		<TextInput
			label="Filter connections"
			placeholder="e.g. Discord, Website..."
			icon={MagnifyingGlass}
			iconProps={{ weight: 'regular' }}
			name="filter"
			bind:value={filter}
			required={false}
			oninput={recalculateDialogHeight}
		/>

		<ul id="provider-list">
			{#each filteredProviders as provider}
				<li>
					<RowItem
						leadingIcon={provider.icon}
						leadingIconProps={provider.iconProps}
						label={provider.name}
						trailingIcon={CaretRight}
						trailingIconProps={{ weight: 'regular' }}
						onclick={() => {
							selectedProvider = provider;
							nextStep();
						}}
					/>
				</li>
			{/each}
		</ul>
	</div>

	<div class="step" inert={currentStep !== 1}>
		<div class="title">
			<Button
				onclick={previousStep}
				icon={ArrowLeft}
				iconProps={{ weight: 'regular' }}
				variant="text"
				type="button"
			/>
			<h1>Connection Details</h1>
		</div>

		<TextInput
			name="connection-identifiable"
			label={selectedProvider?.identifiableInputLabel}
			placeholder={selectedProvider?.identifiableInputPlaceholder ??
				(selectedProvider?.identifiablePrefix
					? `what comes after ${selectedProvider?.identifiablePrefix}`
					: '')}
			bind:value={identifiable}
			maxlength={32}
			required={false}
			oninput={recalculateDialogHeight}
		/>

		<TextInput
			name="connection-label"
			label="Label (optional)"
			placeholder="What does this connection represent?"
			bind:value={label}
			maxlength={32}
			required={false}
			oninput={recalculateDialogHeight}
		/>

		{#if selectedProvider && identifiable}
			<div id="connection-preview">
				<h4>Preview</h4>

				<div id="connection-preview-wrapper" inert>
					<ConnectionComponent
						connection={{
							id: '',
							identifiable,
							label,
							profileId: '',
							provider: selectedProvider.id,
							url: parseIdentifiableUrl(selectedProvider, identifiable) || null,
							verified: false
						}}
						isEditing={false}
					/>
				</div>
			</div>
		{/if}

		<div class="buttons">
			<Button
				type="submit"
				loading={isLoading}
				disabled={isLoading ||
					!identifiable ||
					!selectedProvider?.identifiablePattern?.test(identifiable)}
			>
				Add to profile
			</Button>
		</div>
	</div>
</form>

<style lang="scss">
	@use '../../../styles/mixins.scss';

	#connection-create-dialog {
		display: flex;
		flex-direction: row;
		gap: 0;

		max-width: var(--step-width);
		margin: 0 calc(0px - var(--base-padding) * 1.5);
		overflow: hidden;

		transition: height 300ms ease;
	}

	.step {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		width: var(--step-width);
		padding: 0 calc(var(--base-padding) * 1.5);
		gap: calc(var(--base-gap) * 1.5);
		height: fit-content;
	}

	.title {
		display: flex;
		align-items: center;
		gap: calc(var(--base-gap) * 0.5);
	}

	#provider-list {
		@include mixins.fancy-list;
		max-height: 300px;
		overflow-y: auto;
	}

	#connection-preview {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 0.75);

		#connection-preview-wrapper {
			overflow: hidden;
			border-radius: var(--inputs-border-base-radius);
			background-color: var(--widgets-background-color-dim);
		}
	}
</style>
