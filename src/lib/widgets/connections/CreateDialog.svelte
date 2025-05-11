<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { dialogPortal } from '$lib/components/Dialog/dialog.svelte';
	import RowItem from '$lib/components/RowItem.svelte';
	import Step from '$lib/components/Steps/Step.svelte';
	import Stepper from '$lib/components/Steps/Stepper.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { toaster } from '$lib/components/Toast/toast.svelte';
	import { ArrowLeft, CaretRight, MagnifyingGlass } from 'phosphor-svelte';
	import { connectionProviders, type ConnectionProviderData } from './connection-providers';
	import DetailsForm from './DetailsForm.svelte';

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

	let isLoading = $state(false);
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
>
	<Stepper>
		{#snippet steps({ previousStep, nextStep, recalculateStepperHeight })}
			<Step>
				<div class="step-content">
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
						oninput={recalculateStepperHeight}
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
			</Step>

			<Step>
				<div class="step-content">
					<div class="title-back">
						<Button
							onclick={previousStep}
							icon={ArrowLeft}
							iconProps={{ weight: 'regular' }}
							variant="text"
							type="button"
						/>
						<h1>Connection Details</h1>
					</div>

					<DetailsForm
						bind:label
						bind:identifiable
						provider={selectedProvider}
						oninput={recalculateStepperHeight}
					/>

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
			</Step>
		{/snippet}
	</Stepper>
</form>

<style lang="scss">
	@use '../../../styles/mixins.scss';

	#connection-create-dialog {
		margin: 0 calc(0px - var(--base-padding) * 1.5);
	}

	#provider-list {
		@include mixins.fancy-list;
		max-height: 300px;
		overflow-y: auto;
	}

	.step-content {
		display: flex;
		flex-direction: column;
		padding: 0 calc(var(--base-padding) * 1.5);
		gap: calc(var(--base-gap) * 1.5);
	}

	.title-back {
		display: flex;
		align-items: center;
		gap: calc(var(--base-gap) * 0.5);
	}
</style>
