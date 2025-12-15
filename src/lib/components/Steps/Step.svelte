<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children
	}: {
		children: Snippet;
	} = $props();
</script>

<div role="tab">
	{@render children()}
</div>

<style lang="scss">
	[role='tab'] {
		flex-shrink: 0;
		width: 100%;
		height: fit-content;
		overflow: hidden;
	}
</style>
