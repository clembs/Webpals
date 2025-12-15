<script lang="ts">
	import { PencilSimple } from 'phosphor-svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(),
		fullWidth = false,
		name,
		value = $bindable(''),
		multiline = false,
		maxlength,
		class: className,
		onkeydown,
		onblur,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		ref?: HTMLDivElement;
		fullWidth?: boolean;
		name: string;
		value?: string;
		multiline?: boolean;
		maxlength?: number;
	} = $props();

	let originalValue = $state(value);
</script>

<div class="text-input" data-fullwidth={fullWidth}>
	<div
		id={name}
		class="input {className}"
		contenteditable="true"
		bind:this={ref}
		onkeydown={(ev) => {
			onkeydown?.(ev);
			// Implement max length
			if (maxlength && ev.key !== 'Backspace' && value.length > maxlength) {
				ev.preventDefault();
			}
			// Block new lines if multiline is disabled
			if (ev.key === 'Enter' && !multiline) {
				ev.preventDefault();
				ev.currentTarget.blur();
			}
			// Implement input escaping
			if (ev.key === 'Escape') {
				ev.currentTarget.blur();
			}
		}}
		onblur={(ev) => {
			if (!value.length || value === '\n') {
				value = originalValue;
			}
			onblur?.(ev);
		}}
		bind:innerText={value}
		{...restProps}
	></div>
	<input {name} type="hidden" bind:value />

	<div class="icon">
		<PencilSimple size={18} />
	</div>
</div>

<style lang="scss">
	.text-input {
		// Layout & position
		display: inline-block;
		position: relative;
		width: fit-content;
		cursor: pointer;

		// Hovered/focused state
		&:is(:hover, :focus-within) .input {
			border: var(--inputs-border-width) solid var(--inputs-border-color);
			background-color: var(--inputs-background-color);
		}

		.input {
			// Visual flair
			border-radius: var(--inputs-border-base-radius);
			border: var(--inputs-border-width) solid transparent;

			// Gaps, paddings, margins
			padding-top: calc(var(--base-padding) * 0.25);
			padding-bottom: calc(var(--base-padding) * 0.25);
			padding-left: calc(var(--base-padding) * 0.5);
			// Leave place for the icon within the input
			// 12px gap + icon size + regular 8px padding
			padding-right: calc(var(--base-gap) * 0.75 + 18px + var(--base-padding) * 0.5);

			// Reset paddings so it's all visually aligned
			margin: calc(0px - var(--inputs-border-width) - var(--base-padding) * 0.25)
				calc(0px - var(--inputs-border-width) - var(--base-padding) * 0.5);
		}

		.icon {
			pointer-events: none;
			position: absolute;
			right: 0;
			color: var(--color-heading);
			top: 50%;
			transform: translateY(-50%);
		}

		// Focused state (hide icon and reset input's right padding)
		&:focus-within {
			cursor: auto;

			.input {
				padding-right: calc(var(--base-padding) * 0.5);
			}
			.icon {
				display: none;
			}

			// Full width
			&[data-fullwidth='true'] {
				width: 100%;
			}
		}
	}
</style>
