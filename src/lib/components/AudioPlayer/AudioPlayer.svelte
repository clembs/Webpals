<script lang="ts">
	import { Pause, Play, SpeakerHigh, SpeakerNone } from 'phosphor-svelte';
	import { AudioPlayer } from './headless.svelte';
	import Button from '../Button.svelte';

	let {
		src,
		metadata
	}: {
		src: string;
		metadata?: MediaMetadataInit;
	} = $props();

	let audioEl = $state<HTMLAudioElement>();
	let rangeValue = $state(0);
	let currentTime = $state(0);
	let duration = $state(0);
	let muted = $state(false);
	let paused = $state(true);

	let audioPlayer = $derived(audioEl ? new AudioPlayer(audioEl, metadata) : undefined);
</script>

<div class="audio-player">
	<div class="buttons">
		<Button
			onclick={() => audioPlayer?.togglePlayback()}
			icon={paused ? Play : Pause}
			variant="text"
		/>

		<Button
			onclick={() => audioPlayer?.toggleMute()}
			icon={muted ? SpeakerNone : SpeakerHigh}
			variant="text"
		/>
	</div>

	<input
		onchange={(ev) => {
			if (!audioPlayer?.audioEl) return;
			currentTime = (duration * rangeValue) / 100;
		}}
		onkeydown={(ev) => {
			if (ev.key === ' ') audioPlayer?.togglePlayback();
		}}
		bind:value={rangeValue}
		type="range"
		name="audio-track"
	/>

	<audio
		bind:this={audioEl}
		controls
		bind:paused
		bind:muted
		bind:currentTime
		bind:duration
		ontimeupdate={() => (rangeValue = (currentTime / duration) * 100)}
	>
		<source {src} />
		Your browser does not support the audio element.
	</audio>
</div>

<style lang="scss">
	.audio-player {
		display: flex;
		align-items: center;

		width: 100%;
		gap: calc(var(--base-gap) * 0.5);
		padding-top: calc(var(--base-padding) * 0.25);
		padding-bottom: calc(var(--base-padding) * 0.25);
		padding-left: calc(var(--base-padding) * 0.25);
		padding-right: var(--base-padding);

		background-color: var(--widgets-background-color-dim);
		border-radius: var(--inputs-border-base-radius);

		.buttons {
			display: flex;
		}

		[name='audio-track'] {
			--track-height: calc(var(--base-padding) * 0.25);
			--thumb-size: var(--base-padding);

			height: var(--track-height);

			background-color: var(--widgets-border-color);
			border-radius: 99px;
			// we forget webkit/chrome because it can't style the progress
			// like on firefox
			// as a workaround the closest thing we have is accent-color
			// (not guaranteed to look consistent between implementations though)
			//
			// in the future i'd use something more custom than an input[type='range'] lol
			accent-color: var(--buttons-primary-background-color);

			flex: 1;
			cursor: pointer;

			&::-moz-range-thumb {
				border: none;
				background-color: var(--buttons-primary-background-color);
				border-radius: 99px;
			}
			&::-moz-range-progress {
				height: calc(var(--track-height) * 1.25);

				border: none;
				background-color: var(--buttons-primary-background-color);
				border-radius: 99px;
			}
		}
	}

	audio {
		display: none;
	}
</style>
