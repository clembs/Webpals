<script lang="ts">
	import RowItem from '$lib/components/RowItem.svelte';
	import Step from '$lib/components/Steps/Step.svelte';
	import Stepper from '$lib/components/Steps/Stepper.svelte';
	import { CaretRight } from 'phosphor-svelte';
	import type { MusicJSON } from '../types';
	import { musicProviders } from './helpers';
	import ProviderSettings from './ProviderSettings.svelte';
	import LocalSettings from './LocalSettings.svelte';

	let {
		widget
	}: {
		widget?: MusicJSON;
	} = $props();

	let selectedProvider = $state(widget?.provider);
</script>

<div id="settings-dialog">
	<Stepper currentStep={!widget ? 0 : widget.provider === 'local' ? 2 : 1}>
		{#snippet steps({ previousStep, nextStep, recalculateStepperHeight })}
			<Step>
				<div class="step-content">
					<h1>Set your Music</h1>

					<section id="music-providers">
						<h4>Choose a music provider</h4>

						<p>More providers (YouTube, SoundCloud...) coming soon!</p>

						<ul id="music-providers-list">
							{#each musicProviders as provider (provider.value)}
								<li>
									<RowItem
										leadingIcon={provider.icon}
										label={provider.label}
										subtitle={provider.description}
										onclick={() => {
											selectedProvider = provider.value;
											requestAnimationFrame(() => nextStep());
										}}
										trailingIcon={CaretRight}
										trailingIconProps={{ weight: 'regular' }}
									/>
								</li>
							{/each}
						</ul>
					</section>
				</div>
			</Step>

			{#if selectedProvider}
				{#if selectedProvider === 'local'}
					<LocalSettings {widget} {previousStep} {nextStep} />
				{:else}
					<ProviderSettings
						{selectedProvider}
						{previousStep}
						{nextStep}
						{recalculateStepperHeight}
					/>
				{/if}
			{/if}
		{/snippet}
	</Stepper>
</div>

<style lang="scss">
	@use '../../../styles/mixins.scss';

	#settings-dialog {
		margin: 0 calc(0px - var(--base-padding) * 1.5);
	}

	#music-providers-list {
		@include mixins.fancy-list;
	}

	#music-providers {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 0.75);
	}

	.step-content {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 1.5);
		padding: 0 calc(var(--base-padding) * 1.5);
	}
</style>
