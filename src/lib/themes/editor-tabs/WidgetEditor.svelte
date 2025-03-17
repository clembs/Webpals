<script lang="ts">
	import Switch from '$lib/components/Switch.svelte';
	import LineColorPicker from '$lib/components/ThemeEditor/LineColorPicker.svelte';
	import LineSlider from '$lib/components/ThemeEditor/LineSlider.svelte';
	import { slide } from 'svelte/transition';
	import type { Theme } from '../types';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { page } from '$app/state';
	import { mergeThemes, plainTheme } from '../mergeThemes';

	let { theme = $bindable() }: { theme: Theme } = $props();

	let cleanTheme = $derived(mergeThemes(plainTheme, page.data.currentProfile?.theme ?? {}));
	let showBorderSettings = $state(theme.widgets.border.width > 0);
</script>

<section>
	<section class="subsection">
		<h3>Colors</h3>

		<LineColorPicker
			label="Widgets"
			name="widgets.color_background"
			bind:value={theme.widgets.color_background}
			initialValue={cleanTheme.widgets.color_background}
		/>
		<LineColorPicker
			label="Surfaces on widgets"
			name="widgets.color_background_dim"
			bind:value={theme.widgets.color_background_dim}
			initialValue={cleanTheme?.widgets.color_background_dim}
		/>

		<div class="subtext">To change the color of text and icons, open the Fonts tab.</div>

		<LineSlider
			label="Background blur"
			name="widgets.background_blur"
			bind:value={theme.widgets.background_blur}
			initialValue={cleanTheme.widgets.background_blur}
			min={0}
			max={10}
			step={0.05}
		/>

		<span class="subtext">
			Lower the widgets' background opacity to make the blur effect more visible.
		</span>
	</section>

	<section class="subsection">
		<label class="header" for="toggle-borders">
			<h3>Borders</h3>

			<Switch
				checked={showBorderSettings}
				name="toggle-borders"
				onchange={(e) => {
					if (e.currentTarget.checked) {
						theme.widgets.border.width = cleanTheme.widgets.border.width;
						showBorderSettings = true;
					} else {
						theme.widgets.border.width = 0;
						showBorderSettings = false;
					}
				}}
			/>
		</label>

		{#if showBorderSettings}
			<div class="inline-controls" transition:slide>
				<LineSlider
					label="Roundness"
					name="widgets.border.radius"
					bind:value={theme.widgets.border.radius}
					initialValue={cleanTheme.widgets.border.radius}
					min={0}
					max={3}
					step={0.125}
				/>
				<LineSlider
					label="Thickness"
					name="widgets.border.width"
					bind:value={theme.widgets.border.width}
					initialValue={cleanTheme.widgets.border.width}
					min={0}
					max={10}
				/>

				<ColorPicker
					label="Color"
					position="responsive"
					name="widgets.border.color"
					bind:hex={theme.widgets.border.color}
				/>
			</div>
		{/if}
	</section>
</section>

<style lang="scss">
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
	}

	:global(.color-picker) {
		--input-size: 2rem;
	}

	.inline-controls {
		display: flex;
		gap: calc(var(--base-gap) * 1.5);

		:global(.color-picker > label) {
			flex-direction: column-reverse;
			gap: var(--base-gap);
		}

		@media (max-width: 600px) {
			flex-direction: column;
		}
	}
</style>
