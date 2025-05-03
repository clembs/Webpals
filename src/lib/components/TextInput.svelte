<script lang="ts">
	import type { IconComponentProps } from 'phosphor-svelte';
	import type { Component, Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		name,
		label,
		supportingText,
		error,
		value = $bindable(''),
		icon: Icon,
		iconProps,
		required = true,
		disabled = false,
		...restProps
	}: HTMLInputAttributes & {
		name?: string;
		label?: string;
		supportingText?: Snippet;
		error?: Snippet;
		value?: string;
		icon?: Component<IconComponentProps>;
		iconProps?: IconComponentProps;
	} = $props();
</script>

<label class="text-input" for={name} aria-disabled={disabled}>
	{#if label}
		<div class="label label-text">
			{label}
		</div>
	{/if}

	<div class="input">
		{#if Icon}
			<div class="icon">
				<Icon size="24" {...iconProps} />
			</div>
		{/if}

		<input id={name} {name} {required} {disabled} {...restProps} bind:value />
	</div>

	{#if error || supportingText || restProps.maxlength}
		<div class="bottom">
			{#if error}
				<p class="error">
					{@render error()}
				</p>
			{:else if supportingText}
				<p class="supporting-text">
					{@render supportingText()}
				</p>
			{/if}

			<!-- Whitespace char to always align the max length to the right -->
			&nbsp;

			{#if restProps.maxlength}
				<p>
					{value.length}/{restProps.maxlength.toLocaleString()}
				</p>
			{/if}
		</div>
	{/if}
</label>

<style lang="scss">
	.text-input {
		--border-color: var(--inputs-border-color);
		--input-height: calc(24px + var(--base-padding) * 0.75 * 2); // Icon size + padding

		// Layout
		display: flex;
		flex-direction: column;

		// Gaps, paddings, margins
		gap: calc(var(--base-gap) * 0.5);
		width: 100%;

		// If there's an error, set the border color to color-urgent
		&:has(.error) {
			--border-color: var(--color-urgent);
		}

		&[aria-disabled='true'] {
			.label {
				color: var(--color-paragraph);
			}
			.input {
				color: var(--color-paragraph);
			}
		}

		.input {
			// Layout & position
			display: flex;
			align-items: center;
			position: relative;

			// Gaps, paddings, margins
			height: var(--input-height);

			// Visual flair
			border-radius: var(--inputs-border-base-radius);

			.icon {
				// Layout & position
				display: grid;
				place-items: center;
				position: absolute;

				// Gaps, paddings, margins
				height: var(--input-height);
				width: var(--input-height);
				margin-left: var(--inputs-border-width); // So it doesn't collide with the input's border

				// Visual flair
				background-color: var(--inputs-background-color);
				border-radius: var(--inputs-border-base-radius) 0 0 var(--inputs-border-base-radius);
				border-right: var(--inputs-border-width) solid var(--border-color);
			}

			// Add padding so the input isn't hidden by the icon
			&:has(.icon) input {
				padding-left: calc(var(--input-height) + var(--base-padding));
			}

			input {
				// Gaps, paddings, margins
				width: 100%;
				padding: calc(var(--base-padding) * 0.75) var(--base-padding);

				// Visual flair
				background-color: var(--color-input);
				color: inherit;
				border: var(--inputs-border-width) solid var(--border-color);

				// Typography
				font-weight: 400;
				border-radius: var(--inputs-border-base-radius);
			}
		}

		.bottom {
			display: flex;
			justify-content: space-between;
		}

		.error {
			color: var(--color-urgent);
		}
	}
</style>
