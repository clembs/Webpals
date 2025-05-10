<script lang="ts">
	import BaseWidget from '$lib/widgets/BaseWidget.svelte';
	import type { AboutMeJSON, WidgetComponentProps } from '../types';
	import { enhance } from '$app/forms';
	import { parseMarkdown } from '$lib/helpers/text';
	import InlineTextInput from '$lib/components/InlineTextInput.svelte';

	let { widget, isEditing }: WidgetComponentProps<AboutMeJSON> = $props();

	let formEl = $state<HTMLFormElement>();
	let contentValue = $state(widget.content);
</script>

<BaseWidget {widget} {isEditing}>
	<h3>About me</h3>
	{#if isEditing}
		<form
			use:enhance={() => {
				if (contentValue === widget.content) return;
			}}
			action="/api/profile?/editAboutMe"
			method="post"
			bind:this={formEl}
		>
			<InlineTextInput
				fullWidth
				name="content"
				bind:value={contentValue}
				multiline
				onblur={() => formEl?.requestSubmit()}
			/>
		</form>
	{:else}
		{@html parseMarkdown(widget.content)}
	{/if}
</BaseWidget>

<style lang="scss">
	form {
		display: contents;
	}
</style>
