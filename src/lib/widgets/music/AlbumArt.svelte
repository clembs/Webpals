<script lang="ts">
	import { MusicNote } from 'phosphor-svelte';

	let {
		albumArtUrl,
		title
	}: {
		albumArtUrl: string | null | undefined;
		title: string | null | undefined;
	} = $props();
</script>

{#if albumArtUrl}
	<img
		draggable={false}
		src={albumArtUrl}
		alt="Cover art for {title || 'an unknown song.'}"
		height={52}
		width={52}
		class="album-art"
	/>
{:else}
	<div class="album-art">
		<MusicNote />
	</div>
{/if}

<style lang="scss">
	.album-art {
		display: grid;
		place-items: center;

		height: 52px;
		width: 52px;

		border-radius: calc(var(--widgets-border-base-radius) - var(--base-padding));
		background-color: var(--widgets-background-color-dim);
		color: var(--color-paragraph);
	}
</style>
