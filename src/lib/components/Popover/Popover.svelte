<script lang="ts">
	import { Popover, type WithoutChild } from 'bits-ui';
	import './styles.scss';
	import type { Snippet } from 'svelte';

	let {
		open = $bindable(false),
		children,
		contentProps,
		trigger,
		...restProps
	}: Popover.RootProps & {
		contentProps?: WithoutChild<Popover.ContentProps>;
		children: Snippet;
		trigger: Snippet<[{ props: Record<string, unknown> }]>;
	} = $props();
</script>

<Popover.Root bind:open {...restProps}>
	<Popover.Trigger>
		{#snippet child({ props })}
			{@render trigger({ props })}
		{/snippet}
	</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content {...contentProps}>
			{@render children()}
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
