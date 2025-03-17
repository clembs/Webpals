<script lang="ts">
	import { page } from '$app/state';
	import LineColorPicker from '$lib/components/ThemeEditor/LineColorPicker.svelte';
	import { mergeThemes, plainTheme } from '../mergeThemes';
	import type { Theme } from '../types';

	let { theme = $bindable() }: { theme: Theme } = $props();

	let cleanTheme = $derived(mergeThemes(plainTheme, page.data.currentProfile?.theme ?? {}));
</script>

<section>
	<section class="subsection">
		<h3>Colors</h3>

		<LineColorPicker
			label="Headings color"
			name="font.color_heading"
			bind:value={theme.font.color_heading}
			initialValue={cleanTheme.font.color_heading}
		/>
		<LineColorPicker
			label="Paragraphs color"
			name="font.color_paragraph"
			bind:value={theme.font.color_paragraph}
			initialValue={cleanTheme.font.color_paragraph}
		/>
	</section>
</section>
