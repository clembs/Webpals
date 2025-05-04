<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import ThemeProvider from '$lib/themes/ThemeProvider.svelte';
	import ProfileWidget from '$lib/widgets/profile/ProfileWidget.svelte';
	import { flip } from 'svelte/animate';
	import ProfileEditBar from './ProfileEditBar.svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { invalidateAll } from '$app/navigation';
	import BaseWidget, { isAnyWidgetEditing } from '$lib/widgets/BaseWidget.svelte';
	import NavBar from '$lib/components/NavBar/NavBar.svelte';
	import { defaultWidgets } from '$lib/widgets/widget-metadata';
	import type { AnyWidgetJSON, AboutMeJSON } from '$lib/widgets/types';

	let { data } = $props();

	let theme = $state(data.profile.theme);
	let userWidgets = $state(data.profile.widgets);
	let editing = $state(data.editing);

	$effect(() => {
		theme = data.profile.theme;
		userWidgets = data.profile.widgets;
		editing = data.editing;
	});

	async function updateWidgetPosition(widgetId: string) {
		const newColumn = userWidgets.findIndex((c) => c.find((w) => w.id === widgetId));
		const newPosition = userWidgets[newColumn].findIndex((w) => w.id === widgetId);

		const searchParams = new URLSearchParams();
		searchParams.append('id', widgetId);
		searchParams.append('new-column', newColumn.toString());
		searchParams.append('new-position', newPosition.toString());

		await fetch(`/api/profile?/updateWidgetPosition&${searchParams}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});

		await invalidateAll();
	}
</script>

<Meta
	title={data.profile.displayName || data.profile.username}
	description={(
		userWidgets
			.find((c) => c.find((w) => w.id === 'about_me'))
			?.find((w) => w.id === 'about_me') as AboutMeJSON
	)?.content}
/>

{#snippet widgetEl(widget: AnyWidgetJSON)}
	{@const WidgetComponent = defaultWidgets.find((w) => widget.id === w.id)?.component}

	{#if WidgetComponent}
		<WidgetComponent profile={data.profile} {editing} widget={widget as AnyWidgetJSON} />
	{:else if editing}
		<BaseWidget editingMode={editing} {widget}>
			I didn't code this widget in yet (type {widget.id}).<br />
			Other users won't see this widget, but once it's coded it'll render properly!
		</BaseWidget>
	{/if}
{/snippet}

{#snippet draggableWidgetColumns(widgets: AnyWidgetJSON[], index: number)}
	<div
		class="column"
		use:dndzone={{
			items: widgets,
			flipDurationMs: 200,
			dragDisabled: isAnyWidgetEditing.value
		}}
		onconsider={(ev) => {
			userWidgets[index] = ev.detail.items;
		}}
		onfinalize={async (ev) => {
			userWidgets[index] = ev.detail.items;
			await updateWidgetPosition(ev.detail.info.id);
		}}
	>
		{#each widgets as widget (widget.id)}
			<div class="widget-wrapper" animate:flip={{ duration: 200 }}>
				<ThemeProvider {theme}>
					{@render widgetEl(widget)}
				</ThemeProvider>
			</div>
		{/each}
	</div>
{/snippet}

<ThemeProvider {theme}>
	<div id="profile-root">
		<NavBar />

		<main>
			{#each userWidgets as column, index}
				<div class="column-outer">
					{#if index === 0}
						<ProfileWidget {...data} {editing} />
					{/if}
					{#if editing}
						{@render draggableWidgetColumns(column, index)}
					{:else}
						<div class="column">
							{#each column as widget (widget.id)}
								{@render widgetEl(widget)}
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</main>
	</div>
</ThemeProvider>

{#if data.editable && data.currentProfile && data.currentUser}
	<ProfileEditBar
		currentUser={data.currentUser}
		bind:editing
		profile={data.currentProfile}
		bind:theme
	/>
{/if}

<style lang="scss">
	#profile-root {
		background: var(--background);
		background-size: var(--background-size);
		background-position: var(--background-position);
		background-repeat: var(--background-repeat);
		background-attachment: var(--background-attachment);
		image-rendering: var(--background-rendering);
		flex: 1;
	}

	main {
		display: grid;
		gap: var(--base-gap);
		grid-template-columns: 1fr 1.5fr;
		grid-template-rows: 1fr auto; // thx kevin powell https://stackoverflow.com/a/45897789
		max-width: 60rem;
		margin: 0 auto;
		width: calc(100% - calc(var(--base-padding) * 2));

		.column-outer {
			display: flex;
			flex-direction: column;
			gap: var(--base-gap);
			height: 100%;

			.column {
				display: flex;
				flex-direction: column;
				gap: var(--base-gap);
				height: 100%;
			}
		}

		@media (max-width: 950px) {
			grid-template-columns: 1fr;
			grid-template-rows: 0fr;
		}
	}
</style>
