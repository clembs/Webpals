<script lang="ts">
	import type { IconComponentProps } from 'phosphor-svelte';
	import type { Component } from 'svelte';
	import type {
		HTMLAnchorAttributes,
		HTMLAttributes,
		HTMLButtonAttributes,
		MouseEventHandler
	} from 'svelte/elements';

	let {
		href,
		onclick,
		leadingIcon: LeadingIcon,
		leadingIconProps,
		label,
		subtitle,
		trailingIcon: TrailingIcon,
		trailingIconProps,
		...restProps
	}: (HTMLButtonAttributes | HTMLAnchorAttributes | HTMLAttributes<HTMLDivElement>) & {
		href?: string;
		onclick?: MouseEventHandler<HTMLButtonElement>;
		leadingIcon?: Component<IconComponentProps>;
		leadingIconProps?: IconComponentProps;
		label: string;
		subtitle?: string;
		trailingIcon?: Component<IconComponentProps>;
		trailingIconProps?: IconComponentProps;
	} = $props();
</script>

{#snippet rowItemContents()}
	<div class="leading">
		{#if LeadingIcon}
			<LeadingIcon {...leadingIconProps} />
		{/if}

		<div class="text">
			<div class="clickable">
				{label}
			</div>
			{#if subtitle}
				<p>
					{subtitle}
				</p>
			{/if}
		</div>
	</div>

	{#if TrailingIcon}
		<div class="trailing">
			<TrailingIcon {...trailingIconProps} />
		</div>
	{/if}
{/snippet}

{#if onclick}
	<button
		{onclick}
		class="row-item"
		type="button"
		draggable="false"
		{...restProps as HTMLButtonAttributes}
	>
		{@render rowItemContents()}
	</button>
{:else if href}
	<a
		{href}
		class="row-item"
		target={href.startsWith('http') ? '_blank' : undefined}
		rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
		draggable="false"
		{...restProps as HTMLAnchorAttributes}
	>
		{@render rowItemContents()}
	</a>
{:else}
	<div class="row-item" {...restProps as HTMLAttributes<HTMLDivElement>}>
		{@render rowItemContents()}
	</div>
{/if}

<style lang="scss">
	.row-item {
		display: flex;
		justify-content: space-between;

		&:is(button) {
			appearance: none;
			background-color: transparent;
			border: none;
			cursor: pointer;
		}

		&:is(button, a):hover {
			backdrop-filter: brightness(0.9);
		}

		width: 100%;
		padding: var(--base-padding);
		gap: var(--base-gap);

		.leading {
			display: flex;
			gap: calc(var(--base-gap) * 0.75);

			.text {
				display: flex;
				flex-direction: column;
				gap: calc(var(--base-gap) * 0.5);
			}
		}
	}
</style>
