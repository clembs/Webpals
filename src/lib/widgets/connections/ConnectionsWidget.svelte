<script lang="ts">
	import BaseWidget from '$lib/widgets/BaseWidget.svelte';
	import { Plus } from 'phosphor-svelte';
	import NoContent from '../NoContent.svelte';
	import type { ConnectionsJSON, WidgetComponentProps } from '../types';
	import ConnectionComponent from './ConnectionComponent.svelte';
	import CreateDialog from './CreateDialog.svelte';
	import { slide } from 'svelte/transition';

	let { profile, widget, isEditing }: WidgetComponentProps<ConnectionsJSON> = $props();
</script>

{#snippet settingsDialog()}
	<CreateDialog />
{/snippet}

<BaseWidget
	{widget}
	{isEditing}
	settingsIcon={Plus}
	settingsIconProps={{ weight: 'regular' }}
	{settingsDialog}
>
	<h3>Connections</h3>

	{#if profile.connections.length > 0}
		<ul class="connections-list">
			{#each profile.connections as connection (connection.id)}
				<li out:slide>
					<ConnectionComponent {isEditing} {connection} />
				</li>
			{/each}
		</ul>
	{:else}
		<NoContent {settingsDialog} />
	{/if}
</BaseWidget>

<style lang="scss">
	@use '../../../styles/mixins.scss';

	.connections-list {
		@include mixins.fancy-list;
		overflow: hidden;
	}
</style>
