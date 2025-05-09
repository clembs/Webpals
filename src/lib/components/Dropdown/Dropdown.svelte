<script lang="ts">
	import type { Snippet } from 'svelte';
	import { DropdownMenu, type DropdownMenuRootProps, type WithoutChild } from 'bits-ui';
	import './styles.scss';

	let {
		open = $bindable(false),
		children,
		contentProps,
		trigger,
		...restProps
	}: DropdownMenuRootProps & {
		contentProps?: WithoutChild<DropdownMenu.ContentProps>;
		children: Snippet;
		trigger: Snippet<[{ props: Record<string, unknown> }]>;
	} = $props();
</script>

<DropdownMenu.Root bind:open {...restProps}>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			{@render trigger({ props })}
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content {...contentProps}>
			{@render children()}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
