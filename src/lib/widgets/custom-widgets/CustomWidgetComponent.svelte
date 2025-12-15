<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import BaseWidget from '../BaseWidget.svelte';
	import type { CustomWidgetJSON } from './types';
	import LayoutBlockComponent from './blocks/LayoutBlockComponent.svelte';
	import type { WidgetComponentProps } from '../types';

	let {
		profile,
		widget,
		isEditing
	}: WidgetComponentProps<CustomWidgetJSON> & {
		profile: { id: string };
	} = $props();
</script>

<BaseWidget {widget} {isEditing}>
	{#snippet settingsDialog()}
		<form
			use:enhance={() =>
				({ update }) => {
					update({ reset: false });
				}}
			method="post"
			action="/api/profile?/editCustomWidget&id={widget.id}"
		>
			<LayoutBlockComponent edit user={profile} block={widget} />
			<Button type="submit">Save</Button>
		</form>
	{/snippet}
	<LayoutBlockComponent user={profile} block={widget} />
</BaseWidget>

<style lang="scss">
	form {
		display: flex;
		flex-direction: column;
		gap: var(--base-gap);
	}
</style>
