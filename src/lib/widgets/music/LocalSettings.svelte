<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Step from '$lib/components/Steps/Step.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { supportedAudioMimeTypes, validateFileSignatures } from '$lib/helpers/files';
	import MusicWidget from '$lib/widgets/music/MusicWidget.svelte';
	import type { MusicJSON } from '$lib/widgets/types';
	import { ArrowLeft } from 'phosphor-svelte';
	import { slide } from 'svelte/transition';
	import { Toast, toaster } from '$lib/components/Toast/toast.svelte';
	import { parseWebStream } from 'music-metadata';
	import DropZoneIcon from './DropZoneIcon.svelte';
	import { dialogPortal } from '$lib/components/Dialog/dialog.svelte';

	let {
		widget,
		previousStep,
		nextStep
	}: {
		widget?: MusicJSON | null;
		previousStep: () => void;
		nextStep: () => void;
	} = $props();

	let title = $state(widget?.title || '');
	let artist = $state(widget?.artist || '');
	let contentUrl = $state(widget?.content_url || null);

	let isNewMusic = $state(widget === null);
	let isLoading = $state(false);

	let files = $state<FileList | null | undefined>(null);
	let isDragging = $state(false);

	async function handleFilesChange() {
		const file = files?.[0];

		// When the file is loaded, check its MIME type
		if (!file || !file.type.startsWith('audio/')) {
			toaster.error('Unsupported file type.');
			return;
		}

		// check the file signature to be extra sure
		const isValidMimeSignature = await validateFileSignatures(file, supportedAudioMimeTypes);

		if (!isValidMimeSignature) {
			toaster.error('Unsupported file type.');
			return;
		}

		if (file.size > 10 * 1024 * 1024) {
			toaster.error('File must be less than 10 MB in size.');
			return;
		}

		// check if the music's duration is above 10 minutes
		const metadata = await parseWebStream(file.stream());

		if (metadata.format?.duration && metadata.format.duration > 600) {
			toaster.error('Music must be less than 10 minutes in duration.');
			return;
		}

		title = metadata.common?.title || file.name;
		artist = metadata.common?.artist || '';
		contentUrl = URL.createObjectURL(file);

		nextStep();
	}
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
			<h1>Upload a File</h1>
		</div>

		<!-- * The input itself is on the second step so it can be sent as part of the form  -->
		<label
			for="audio-file-upload"
			data-is-dragging={isDragging}
			ondragenter={(e) => {
				e.preventDefault();
				isDragging = true;
			}}
			ondragover={(e) => {
				e.preventDefault();
				isDragging = true;
			}}
			ondragleave={(e) => {
				e.preventDefault();
				isDragging = false;
			}}
			ondragexit={(e) => {
				e.preventDefault();
				isDragging = false;
			}}
			ondrop={(e) => {
				e.preventDefault();
				isDragging = false;

				files = e.dataTransfer?.files;
				handleFilesChange();
			}}
		>
			<span class="heading">
				<DropZoneIcon />

				{#if isDragging}
					Drop the file here to upload!
				{:else}
					Drag a music file here or click the area to upload
				{/if}
			</span>
			{#if !isDragging}
				<span class="subtext" transition:slide>
					Any MP3, FLAC or WAV file under 10 MB or 10 minutes.
				</span>
			{/if}
		</label>
	</div>
</Step>

<Step>
	<form
		use:enhance={() => {
			isLoading = true;

			let toast: Toast;
			if (files?.length) {
				toast = toaster.load('Uploading track...');
			}

			return async ({ result, update }) => {
				isLoading = false;

				if (result.type === 'success') {
					if (toast) {
						toast.success('Music successfully uploaded!');
					} else {
						toaster.success('Music details successfully updated!');
					}
				} else if (result.type === 'failure' && typeof result.data?.message === 'string') {
					if (toast) {
						toast.error({
							title: 'Music could not be uploaded!',
							subtitle: result.data.message
						});
					} else {
						toaster.error({
							title: 'Music could not be updated!',
							subtitle: result.data.message
						});
					}
				}

				dialogPortal.closeDialog();

				await update({ reset: false, invalidateAll: true });
			};
		}}
		class="step-content"
		action="/api/profile?/setLocalMusic"
		method="post"
		enctype="multipart/form-data"
	>
		<div class="title-back">
			<Button
				onclick={previousStep}
				icon={ArrowLeft}
				iconProps={{ weight: 'regular' }}
				variant="text"
				type="button"
			/>
			<h1>Set Music Details</h1>
		</div>

		<input
			type="file"
			accept={supportedAudioMimeTypes.join(', ')}
			id="audio-file-upload"
			name="audio-file"
			bind:files
			onchange={(e) => {
				e.preventDefault();
				handleFilesChange();
			}}
		/>

		<TextInput
			name="title"
			label="Song title"
			placeholder="Name of the song"
			maxlength={80}
			bind:value={title}
		/>
		<TextInput
			name="artist"
			label="Artist(s)"
			placeholder="Names of the contributing artists"
			maxlength={50}
			bind:value={artist}
		/>

		<div id="preview">
			<h4>Preview</h4>

			<MusicWidget
				widget={{
					id: 'music',
					album_art_url: null,
					title: title,
					artist: artist,
					content_url: contentUrl,
					provider: 'local',
					external_url: null
				}}
				isEditing={false}
			/>
		</div>

		<div class="buttons">
			<Button
				type="submit"
				loading={isLoading}
				disabled={isLoading ||
					!title ||
					!artist ||
					!contentUrl ||
					(title === widget?.title && artist === widget?.artist)}
			>
				{#if isNewMusic}
					Upload music
				{:else}
					Save changes
				{/if}
			</Button>
		</div>
	</form>
</Step>

<style lang="scss">
	#audio-file-upload {
		display: none;
	}

	[for='audio-file-upload'] {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 0.5);
		width: 100%;
		height: 100%;
		min-height: 250px;
		border: 3px dashed var(--widgets-background-color-dim);
		border-radius: var(--inputs-border-base-radius);
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: border 1000ms;
		padding: calc(var(--base-padding) * 1.5);
		text-align: center;
		text-wrap: balance;

		.heading {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 1.25rem;
		}

		&[data-is-dragging='true'] {
			border: 3px solid var(--widgets-background-color-dim);
		}
	}

	.title-back {
		display: flex;
		align-items: center;
		gap: calc(var(--base-gap) * 0.5);
	}

	.step-content {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 1.5);
		padding: 0 calc(var(--base-padding) * 1.5);
	}

	.buttons {
		display: flex;
		gap: calc(var(--base-gap) * 0.5);
		justify-content: flex-end;
	}

	#preview {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 0.75);
	}
</style>
