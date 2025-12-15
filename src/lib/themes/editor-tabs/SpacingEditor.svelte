<script lang="ts">
	import { page } from '$app/state';
	import LineSlider from '$lib/components/ThemeEditor/LineSlider.svelte';
	import { mergeThemes } from '../merge-themes';
	import { plainTheme } from '../plain-theme';
	import type { Theme } from '../types';

	let { theme = $bindable() }: { theme: Theme } = $props();

	let cleanTheme = $derived(mergeThemes(page.data.currentProfile?.theme ?? {}, plainTheme));
</script>

<section>
	<section class="subsection">
		<LineSlider
			label="Base padding"
			name="spacing.padding"
			bind:value={theme.spacing.padding}
			initialValue={cleanTheme.spacing.padding}
			min={0.25}
			max={2}
			step={0.125}
		/>

		<LineSlider
			label="Spacing outside content in a widget"
			name="spacing.gap"
			bind:value={theme.spacing.gap}
			initialValue={cleanTheme.spacing.gap}
			min={0.25}
			max={2}
			step={0.125}
		/>
	</section>
</section>
