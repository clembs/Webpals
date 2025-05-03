<script lang="ts">
	import Spinner from '$icons/Spinner.svelte';
	import type { IconComponentProps } from 'phosphor-svelte';
	import type { Component, Snippet } from 'svelte';
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';

	let {
		href,
		onclick,
		type,
		variant = 'primary',
		disabled = false,
		icon: Icon,
		iconProps,
		size = 'md',
		loading = false,
		children,
		...restProps
	}: (HTMLButtonAttributes | HTMLAnchorAttributes) & {
		href?: string;
		onclick?: () => void;
		type?: 'submit' | 'button';
		variant?: 'primary' | 'secondary' | 'text' | 'success' | 'urgent';
		disabled?: boolean;
		icon?: Component<IconComponentProps>;
		iconProps?: IconComponentProps;
		size?: 'sm' | 'md';
		loading?: boolean;
		children?: Snippet;
	} = $props();

	let labelType = $derived(
		((children ? 'label' : '') + (children && Icon ? '+' : '') + (Icon ? 'icon' : '')) as
			| 'label'
			| 'label+icon'
			| 'icon'
	);
</script>

{#if href}
	<a
		{href}
		target={href.startsWith('http') ? '_blank' : undefined}
		rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
		data-label-type={labelType}
		data-variant={variant}
		data-size={size}
		aria-disabled={disabled}
		draggable="false"
		{...restProps as HTMLAnchorAttributes}
	>
		{#if loading}
			<Spinner />
		{:else if Icon}
			<Icon {...iconProps} />
		{/if}

		{@render children?.()}
	</a>
{:else}
	<button
		{onclick}
		{type}
		data-label-type={labelType}
		data-variant={variant}
		data-size={size}
		{disabled}
		draggable="false"
		{...restProps as HTMLButtonAttributes}
	>
		{#if loading}
			<Spinner />
		{:else if Icon}
			<Icon {...iconProps} />
		{/if}

		{@render children?.()}
	</button>
{/if}

<style lang="scss">
	a,
	button {
		// Layout
		display: inline-flex;
		gap: calc(var(--base-gap) * 0.5);

		// Alignment
		text-align: center;
		justify-content: center;
		align-items: center;

		// Size & padding
		height: var(--button-size);
		padding: var(--padding);

		// Visual flair
		border: var(--border-style);
		background-color: var(--background-color);
		color: var(--on-background-color);
		border-radius: var(--border-radius);

		// Font
		font-weight: 500;

		// Misc
		cursor: pointer;
		text-decoration: none;
		user-select: none;
		flex-shrink: 0;

		// Icon size
		:global(svg) {
			height: var(--icon-size);
			width: var(--icon-size);
		}

		// Hover state
		&:hover:not(:disabled, [aria-disabled='true']) {
			filter: brightness(0.95);
		}

		// Medium-sized buttons
		&[data-size='md'] {
			--button-size: 2.75rem;
			--icon-size: 24px;
			--padding: 0 var(--base-padding);
			--border-radius: var(--inputs-border-base-radius);
		}

		// Small-sized buttons
		&[data-size='sm'] {
			--button-size: 2.25rem;
			--icon-size: 18px;
			--padding: 0 calc(var(--base-padding) * 0.75);
			--border-radius: calc(var(--inputs-border-base-radius) * 3);
		}

		// Color variants
		&[data-variant='primary'] {
			--background-color: var(--buttons-primary-background-color);
			--on-background-color: var(--buttons-primary-on-background-color);
			--border-style: var(--inputs-border-width) solid var(--buttons-primary-border-color);
		}

		&[data-variant='secondary'] {
			--background-color: var(--inputs-background-color);
			--on-background-color: var(--inputs-on-background-color);
			--border-style: var(--inputs-border-width) solid var(--inputs-border-color);
		}

		&[data-variant='text'] {
			--background-color: transparent;
			--on-background-color: var(--inputs-on-background-color);
			--border-style: transparent solid var(--inputs-border-color);

			// Hover (h)override for text buttons to filter on the backdrop
			// Since the button is transparent
			&:hover:not(:disabled, [aria-disabled='true']) {
				backdrop-filter: brightness(0.95);
			}
		}

		&[data-variant='success'] {
			--background-color: var(--color-success);
			--on-background-color: var(--buttons-primary-on-background-color);
			--border-style: var(--inputs-border-width) solid var(--color-success);
		}

		&[data-variant='urgent'] {
			--background-color: var(--color-urgent);
			--on-background-color: var(--buttons-primary-on-background-color);
			--border-style: var(--inputs-border-width) solid var(--color-urgent);
		}

		// Disabled state overrides
		&:disabled,
		&[aria-disabled='true'] {
			opacity: 0.5;
			cursor: not-allowed;
		}

		// Label type overrides
		&[data-label-type='label+icon'] {
			&[data-size='md'] {
				--padding: 0 var(--base-padding) 0 calc(var(--base-padding) * 0.75);
			}

			&[data-size='sm'] {
				--padding: 0 calc(var(--base-padding) * 0.75) 0 calc(var(--base-padding) * 0.625);
			}
		}

		&[data-label-type='icon'] {
			--padding: 0;
			width: var(--button-size);
		}
	}
</style>
