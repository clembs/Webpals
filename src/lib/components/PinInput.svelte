<script lang="ts">
	import { PinInput } from 'bits-ui';

	let {
		label,
		...restProps
	}: PinInput.RootProps & {
		label?: string;
	} = $props();
</script>

<PinInput.Root {...restProps}>
	{#snippet children({ cells })}
		<div class="label">{label}</div>

		<div class="cells">
			{#each cells as cell}
				<PinInput.Cell {cell}>
					{#snippet child({ props })}
						{#if cell.char}
							<div class="cell headline" data-active={cell.isActive} {...props}>
								{cell.char}
							</div>
						{:else}
							<div class="cell headline placeholder" data-active={cell.isActive} {...props}>-</div>
						{/if}
					{/snippet}
				</PinInput.Cell>
			{/each}
		</div>
	{/snippet}
</PinInput.Root>

<style lang="scss">
	.label {
		margin-bottom: calc(var(--base-gap) * 0.5);
	}

	.cells {
		display: flex;

		width: 100%;

		border: var(--inputs-border-width) solid var(--inputs-border-color);
		border-radius: var(--inputs-border-base-radius);
		color: var(--inputs-on-background-color);
	}

	.cell {
		display: grid;
		place-items: center;

		flex: 1;
		padding: calc(var(--base-padding) * 0.75);

		&:not(:last-child) {
			border-right: var(--inputs-border-width) solid var(--inputs-border-color);
		}

		&.placeholder {
			color: var(--color-paragraph);
		}

		&:first-child {
			border-radius: var(--inputs-border-base-radius) 0 0 var(--inputs-border-base-radius);
		}

		&:last-child {
			border-radius: 0 var(--inputs-border-base-radius) var(--inputs-border-base-radius) 0;
		}

		&:global([data-active]) {
			box-shadow:
				0 0 0 2px var(--background),
				0 0 0 4px var(--buttons-primary-background-color);
		}
	}
</style>
