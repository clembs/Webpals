<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { dialogPortal } from '$lib/components/Dialog/dialog.svelte';
	import { X, type IconComponentProps } from 'phosphor-svelte';
	import { type Component, type Snippet } from 'svelte';

	let {
		icon: Icon,
		iconProps,
		label,
		header,
		open = $bindable(false),
		children
	}: {
		icon: Component<IconComponentProps>;
		iconProps?: IconComponentProps;
		label: string;
		header: Snippet;
		children: Snippet;
		open: boolean;
	} = $props();

	let addWidgetMenuScroll = $state(0);
</script>

<svelte:window
	onkeydown={(ev) => {
		if (ev.key === 'Escape' && !dialogPortal.wasOpened() && open) {
			open = false;
		}
	}}
/>

<button onclick={() => (open = true)}>
	<Icon {...iconProps} />
	{label}
</button>

{#if open}
	<div class="bar-menu">
		<div class="header" class:scrolling={addWidgetMenuScroll}>
			{@render header()}

			<div class="trailing">
				<Button
					onclick={() => (open = false)}
					variant="text"
					icon={X}
					iconProps={{ weight: 'regular' }}
				/>
			</div>
		</div>

		<div
			class="scrollable"
			onscroll={(ev) => (addWidgetMenuScroll = (ev.target as HTMLUListElement).scrollTop)}
		>
			{@render children()}
		</div>
	</div>
{/if}

<style lang="scss">
	@use '../../styles/mixins.scss';

	button {
		display: flex;
		align-items: center;
		justify-content: center;

		min-width: 150px;
		padding: var(--base-padding);
		gap: calc(var(--base-gap) * 0.5);

		background-color: var(--widgets-background-color);
		border: none;
		border-radius: var(--inputs-border-base-radius);
		font-weight: 500;

		cursor: pointer;
	}

	.bar-menu {
		@include mixins.card;

		display: flex;
		flex-direction: column;

		width: 50rem;
		height: 30rem;
		padding: 0px;
		gap: 0px;

		background-color: var(--widgets-background-color);

		position: fixed;
		bottom: var(--base-padding);
		left: 50%;
		transform: translateX(-50%);

		overflow: hidden;

		@media (max-width: 50rem) {
			width: 100%;
		}

		.header {
			display: grid;
			grid-template-columns: 1fr 2fr 1fr;
			justify-content: center;
			gap: var(--base-gap);
			padding: calc(var(--base-padding) * 1.25);
			border-bottom: var(--widgets-border-width) solid transparent;
			transition: border-color 200ms;
			color: var(--color-heading);
			text-align: center;

			&.scrolling {
				border-bottom: var(--widgets-border-width) solid var(--widgets-border-color);
			}

			.trailing {
				display: flex;
				justify-content: flex-end;
			}
		}

		.scrollable {
			display: flex;
			flex-direction: column;
			overflow-y: scroll;
			flex: 1;
		}
	}
</style>
