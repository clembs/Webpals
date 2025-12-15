<script lang="ts">
	import { DropdownMenu, type DropdownMenuItemProps } from 'bits-ui';
	import type { IconComponentProps } from 'phosphor-svelte';
	import type { Component } from 'svelte';

	let {
		children,
		variant,
		icon: Icon,
		iconProps,
		...restProps
	}: DropdownMenuItemProps & {
		variant?: 'primary' | 'urgent';
		icon?: Component<IconComponentProps>;
		iconProps?: IconComponentProps;
	} = $props();
</script>

<DropdownMenu.Item {...restProps} data-variant={variant}>
	{#if Icon}
		<Icon {...iconProps} />
	{/if}

	{@render children?.()}
</DropdownMenu.Item>
