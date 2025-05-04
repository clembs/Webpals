<script lang="ts">
	import BaseWidget from '$lib/widgets/BaseWidget.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { AboutMeJSON, WidgetComponentProps } from '../types';
	import { enhance } from '$app/forms';
	import { parseMarkdown } from '$lib/helpers/text';

	let { widget, editing }: WidgetComponentProps<AboutMeJSON> = $props();
</script>

<BaseWidget {widget} {editing}>
	{#snippet settingsDialog()}
		<form
			use:enhance={() =>
				({ update }) => {
					update({ reset: false });
				}}
			class="about-me-edit"
			action="/api/profile?/editAboutMe"
			method="post"
		>
			<h2>About me</h2>
			<textarea name="content" value={widget.content}></textarea>
			<Button type="submit">Save</Button>
		</form>
	{/snippet}
	<div class="about-me">
		<h2>About me</h2>
		{@html parseMarkdown(widget.content)}
	</div>
</BaseWidget>

<style lang="scss">
	.about-me {
		display: flex;
		flex-direction: column;
		gap: var(--base-gap);
	}
	h2 {
		font-size: 1.5rem;
	}

	.about-me-edit {
		display: flex;
		flex-direction: column;
		gap: var(--base-gap);

		textarea {
			background-color: var(--widgets-background-color);
			color: var(--color-paragraph);
			border: none;
			outline: none;
			font-size: 0.9rem;
			transition: font-size 200ms;
			resize: vertical;
			min-height: 10rem;
		}
	}
</style>
