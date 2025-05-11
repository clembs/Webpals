<script lang="ts">
	import { enhance } from '$app/forms';
	import AudioPlayer from '$lib/components/AudioPlayer/AudioPlayer.svelte';
	import Button from '$lib/components/Button.svelte';
	import Step from '$lib/components/Steps/Step.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { musicProviders, type MusicProvider, type Track } from '$lib/widgets/music/helpers';
	import { Accordion } from 'bits-ui';
	import { ArrowLeft, ArrowSquareOut, CaretDown, MagnifyingGlass } from 'phosphor-svelte';
	import AlbumArt from './AlbumArt.svelte';
	import { slide } from 'svelte/transition';
	import { toaster } from '$lib/components/Toast/toast.svelte';
	import { dialogPortal } from '$lib/components/Dialog/dialog.svelte';

	let {
		selectedProvider,
		previousStep,
		nextStep,
		recalculateStepperHeight
	}: {
		selectedProvider: MusicProvider;
		previousStep: () => void;
		nextStep: () => void;
		recalculateStepperHeight: () => void;
	} = $props();

	let isSettingLoading = $state(false);
	let selectedProviderData = $derived(musicProviders.find((p) => p.value === selectedProvider)!);

	// search-related states
	let isSearchLoading = $state(false);
	let searchQuery = $state('');
	let tracks = $state<Track[]>();
</script>

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
			<h1>Select a Track</h1>
		</div>

		<form
			id="search-form"
			use:enhance={() => {
				isSearchLoading = true;

				return async ({ result, update }) => {
					isSearchLoading = false;

					if (result.type === 'success' && result.data) {
						tracks = result.data as any;
						recalculateStepperHeight();
					}

					await update({ reset: false });
				};
			}}
			action="/api/search/{selectedProvider}?"
			method="post"
		>
			<TextInput
				name="query"
				label="Search {selectedProviderData.label}"
				placeholder="Search tracks, albums, artists..."
				bind:value={searchQuery}
			/>

			<Button
				disabled={isSearchLoading || !searchQuery}
				loading={isSearchLoading}
				style="width: 100%;"
				type="submit"
				icon={MagnifyingGlass}
				iconProps={{ weight: 'regular' }}
			>
				Search
			</Button>
		</form>

		{#if tracks}
			<Accordion.Root type="single">
				<ul id="results">
					{#each tracks as track (track.id)}
						{@const albumCoverArt = track.album.images?.[0]?.url}
						<Accordion.Item value={track.id}>
							{#snippet child({ props })}
								{@const isOpen = props['data-state'] === 'open'}
								<li class="result" {...props}>
									<Accordion.Trigger>
										{#snippet child({ props })}
											<button class="result-trigger" {...props}>
												<div class="leading">
													<AlbumArt albumArtUrl={albumCoverArt} title={track.name} />

													<div class="text">
														<h4 class="clickable">
															{track.name}
														</h4>
														<p>{track.artists.map(({ name }) => name).join(', ')}</p>
													</div>
												</div>

												<div class="caret-icon-wrapper" data-rotate={isOpen}>
													<CaretDown weight="regular" />
												</div>
											</button>
										{/snippet}
									</Accordion.Trigger>

									<Accordion.Content forceMount>
										{#snippet child({ props, open })}
											{#if open}
												<div class="result-content" {...props} transition:slide>
													{#if track.preview_url}
														<AudioPlayer
															src={track.preview_url}
															metadata={{
																title: track.name,
																album: track.album.name,
																artist: track.artists.map(({ name }) => name).join(', '),
																artwork: albumCoverArt
																	? [
																			{
																				src: albumCoverArt,
																				type: 'image/jpeg'
																			}
																		]
																	: []
															}}
														/>
													{:else}
														No preview :'(
													{/if}

													<div class="buttons">
														<Button
															href={track.external_urls.spotify}
															icon={ArrowSquareOut}
															iconProps={{ weight: 'regular' }}
															variant="text"
														>
															Listen on {selectedProviderData.label}
														</Button>

														<form
															use:enhance={() => {
																isSettingLoading = true;
																return async ({ result, update }) => {
																	isSettingLoading = false;

																	if (result.type === 'success') {
																		toaster.success('Music details successfully updated!');
																	} else if (
																		result.type === 'failure' &&
																		typeof result.data?.message === 'string'
																	) {
																		toaster.error({
																			title: 'Music could not be updated!',
																			subtitle: result.data.message
																		});
																	}

																	dialogPortal.closeDialog();

																	await update({ reset: false, invalidateAll: true });
																};
															}}
															action="/api/profile?/setExternalMusic&provider={selectedProvider}&track-id={track.id}"
															method="post"
														>
															<Button
																type="submit"
																loading={isSettingLoading}
																disabled={isSettingLoading}
															>
																Save to profile
															</Button>
														</form>
													</div>
												</div>
											{/if}
										{/snippet}
									</Accordion.Content>
								</li>
							{/snippet}
						</Accordion.Item>
					{/each}
				</ul>
			</Accordion.Root>
		{/if}
	</div>
</Step>

<style lang="scss">
	@use '../../../styles/mixins.scss';

	.step-content {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 1.5);
		padding: 0 calc(var(--base-padding) * 1.5);
	}

	.title-back {
		display: flex;
		align-items: center;
		gap: calc(var(--base-gap) * 0.5);
	}

	#search-form {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 0.5);
	}

	#results {
		@include mixins.fancy-list;
		max-height: 400px;
		overflow-y: scroll;
	}

	.result {
		display: flex;
		flex-direction: column;
		padding: calc(var(--base-padding) * 0.75) var(--base-padding);
	}

	.result-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;

		gap: calc(var(--base-gap) * 0.5);
		width: 100%;

		background-color: transparent;
		border: none;

		text-align: left;
		cursor: pointer;

		.leading {
			display: flex;
			align-items: center;
			gap: calc(var(--base-gap) * 0.5);

			.text {
				display: flex;
				flex-direction: column;
				gap: calc(var(--base-gap) * 0.25);
			}
		}

		.caret-icon-wrapper {
			transition: rotate 200ms ease;

			&[data-rotate='true'] {
				rotate: 180deg;
			}
		}
	}

	.result-content {
		display: flex;
		flex-direction: column;

		padding: calc(var(--base-padding) * 0.5) 0px;
		gap: calc(var(--base-gap) * 0.5);

		.buttons {
			display: flex;
			justify-content: flex-end;

			width: 100%;
			gap: calc(var(--base-gap) * 0.5);
		}
	}
</style>
