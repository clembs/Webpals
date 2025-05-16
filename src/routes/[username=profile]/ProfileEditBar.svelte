<script lang="ts">
	import type { CurrentProfile } from '$lib/db/types';
	import type { Theme } from '$lib/themes/types';
	import { Eye, PencilSimple, Plus, Gear, Palette, Hexagon } from 'phosphor-svelte';
	// import WidgetPickerMenu from './WidgetPickerMenu.svelte';
	// import AccountSettingsMenu from './AccountSettingsMenu.svelte';
	import ThemeEditorMenu from './ThemeEditorMenu.svelte';
	import ThemeProvider from '$lib/themes/ThemeProvider.svelte';
	import { replaceState } from '$app/navigation';
	import type { User } from '@supabase/supabase-js';
	import { plainTheme } from '$lib/themes/plain-theme';

	let {
		isEditing = $bindable(),
		profile = $bindable(),
		theme = $bindable(),
		currentUser
	}: {
		isEditing: boolean;
		profile: CurrentProfile;
		theme: Theme;
		currentUser: User;
	} = $props();

	let themeEditorOpen = $state(false);

	let editBarEl = $state<HTMLDivElement>();
	let editBarWrapperEl = $state<HTMLDivElement>();

	// handles the fancy animation when toggling between view and edit mode
	// if i ever need to change any of this i'm just gonna cry ;-;
	// function toggleMode() {
	// 	if (!editBarWrapperEl || !toggleModesButtonEl || !editBarEl) return;

	// 	isEditing = !isEditing;

	// 	// switch to editing
	// 	if (isEditing) {
	// 		replaceState(`/${profile.username}`, {});

	// 		// expand animation
	// 		editBarWrapperEl.style.width = `${toggleModesButtonEl.clientWidth}px`;
	// 		editBarWrapperEl.style.transition = `width 500ms cubic-bezier(0.75, -0.2, 0.15, 1)`;
	// 		editBarEl.style.transform = `none`;

	// 		requestAnimationFrame(() => {
	// 			editBarWrapperEl!.style.width = `${editBarEl!.clientWidth}px`;
	// 		});

	// 		editBarWrapperEl.addEventListener(
	// 			'transitionend',
	// 			() => {
	// 				editBarWrapperEl!.style.width = '';
	// 				editBarWrapperEl!.style.transition = '';
	// 			},
	// 			{ once: true }
	// 		);
	// 	}
	// 	// switch to viewing
	// 	else {
	// 		replaceState(`/${profile.username}?view`, {});

	// 		// collapse animation
	// 		editBarWrapperEl.style.transition = `width 500ms cubic-bezier(0.75, -0.2, 0.15, 1)`;
	// 		editBarWrapperEl.style.width = `${editBarEl.clientWidth}px`;

	// 		editBarEl.style.transform = `translateX(calc(0px - var(--toggle-modes-button-width) - 20px))`;

	// 		requestAnimationFrame(() => {
	// 			editBarWrapperEl!.style.width = `${toggleModesButtonEl!.clientWidth}px`;
	// 		});

	// 		editBarWrapperEl.addEventListener('transitionend', () => {
	// 			editBarWrapperEl!.style.transition = '';
	// 			editBarWrapperEl!.style.width = '';
	// 		});
	// 	}
	// }
</script>

<div id="edit-area" bind:this={editBarWrapperEl} class:viewing={!isEditing}>
	<!-- <WidgetPickerMenu {profile} {editBarEl} {editBarWrapperEl} bind:menuOpen={widgetPickerOpen} /> -->

	<!-- <AccountSettingsMenu
			{currentUser}
			{profile}
			{editBarEl}
			{editBarWrapperEl}
			bind:menuOpen={accountSettingsOpen}
		/> -->

	<div id="edit-toolbar" bind:this={editBarEl}>
		<!-- commands -->
		<ThemeEditorMenu bind:theme {editBarEl} {editBarWrapperEl} bind:menuOpen={themeEditorOpen} />

		<!-- {#if isEditing}
				<button
					id="toggle-modes-button"
					class:hovering={editModeButtonHover}
					class="switch-to-view"
					aria-label="Switch to view mode"
					onmouseenter={() => (editModeButtonHover = true)}
					onmouseleave={() => (editModeButtonHover = false)}
					onfocus={() => (editModeButtonHover = true)}
					onblur={() => (editModeButtonHover = false)}
					onclick={toggleMode}
					bind:this={toggleModesButtonEl}
				>
					{#if editModeButtonHover}
						<Eye />
						<span class="label"> Switch to view mode </span>
					{:else}
						<PencilSimple />
						<span class="label"> Currently in edit mode </span>
					{/if}
				</button>
			{:else}
				<button
					id="toggle-modes-button"
					aria-label="Switch to edit mode"
					onclick={toggleMode}
					bind:this={toggleModesButtonEl}
				>
					<PencilSimple />
					<span class="label">
						<div class="label">Switch to edit mode</div>
					</span>
				</button>
			{/if} -->
	</div>
</div>

<style lang="scss">
	#edit-area {
		display: flex;
		flex-direction: column;
		align-items: center;

		margin: 0 auto;
		padding: var(--base-padding);

		position: fixed;
		bottom: 0;
		width: 100%;

		&::before {
			content: '';

			position: fixed;
			left: 0;
			bottom: var(--bottom-navbar-height, 0);

			width: 100%;
			height: 120px;

			background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);

			pointer-events: none;
		}
	}

	#edit-toolbar {
		display: flex;
		gap: calc(var(--base-gap) * 0.5);

		z-index: 1000;
	}
</style>
