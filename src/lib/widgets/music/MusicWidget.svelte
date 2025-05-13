<script lang="ts">
	import BaseWidget from '../BaseWidget.svelte';
	import type { MusicJSON, WidgetComponentProps } from '../types';
	import AudioPlayer from '$lib/components/AudioPlayer/AudioPlayer.svelte';
	import { PUBLIC_STORAGE_BASE_URL } from '$env/static/public';
	import MusicSettings from './MusicSettings.svelte';
	import AlbumArt from './AlbumArt.svelte';
	import NoContent from '../NoContent.svelte';

	let { widget, isEditing }: Omit<WidgetComponentProps<MusicJSON>, 'profile'> = $props();

	let isEmpty = $derived(
		!widget.provider || !widget.title || !widget.artist || !widget.content_url
	);
</script>

{#snippet settingsDialog()}
	<MusicSettings {widget} />
{/snippet}

{#if isEditing || !isEmpty}
	<BaseWidget {widget} {isEditing} {settingsDialog}>
		<div class="music-widget">
			<div class="metadata">
				<AlbumArt albumArtUrl={widget.album_art_url} title={widget.title} />

				<div class="text">
					<h3>
						{widget.title || 'Song title'}
					</h3>

					<p>
						{widget.artist || 'Song artist(s)'}
					</p>
				</div>
			</div>

			{#if !isEmpty}
				<AudioPlayer
					src={widget.provider === 'local' && widget.content_url!.includes('music/')
						? `${PUBLIC_STORAGE_BASE_URL}/${widget.content_url!}`
						: widget.content_url!}
					metadata={{
						title: widget.title || '',
						artist: widget.artist || '',
						...(widget.album_art_url
							? {
									artwork: [
										{
											src: widget.album_art_url,
											type: 'image/jpeg'
										}
									]
								}
							: {})
					}}
				/>
			{:else}
				<NoContent {settingsDialog} />
			{/if}
		</div>
	</BaseWidget>
{/if}

<style lang="scss">
	.music-widget {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 0.75);
		color: var(--color-heading);

		.metadata {
			display: flex;
			gap: calc(var(--base-gap) * 0.75);
			align-items: center;

			.text {
				display: flex;
				flex-direction: column;
				gap: calc(var(--base-gap) * 0.125);
			}

			h3,
			p {
				display: -webkit-box;
				-webkit-line-clamp: 2;
				line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}
		}
	}
</style>
