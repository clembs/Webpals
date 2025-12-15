<script lang="ts">
	import { onMount } from 'svelte';
	import BaseWidget from '../BaseWidget.svelte';
	import type { ClockJSON, WidgetComponentProps } from '../types';
	import { Globe, PencilSimple } from 'phosphor-svelte';
	import Popover from '$lib/components/Popover/Popover.svelte';
	import TimezonePopover from './TimezonePopover.svelte';
	import ClockSettings from './ClockSettings.svelte';

	let { widget, isEditing }: WidgetComponentProps<ClockJSON> = $props();

	let popoverOpen = $state(false);
	let date = $state(new Date());

	let timeParts = $derived(
		new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			...(widget.show_seconds ? { second: 'numeric' } : {}),
			hour12: widget.hour_format === '12h',
			timeZoneName: 'short',
			timeZone: widget.timezone
		}).formatToParts(date)
	);

	let timeString = $derived(
		timeParts.find(({ type }) => type === 'hour')?.value +
			':' +
			timeParts.find(({ type }) => type === 'minute')?.value +
			`${widget.show_seconds ? ':' + timeParts.find(({ type }) => type === 'second')?.value : ''}`
	);

	let dayPeriod = $derived(
		timeParts.find(({ type }) => type === 'dayPeriod')?.value as 'AM' | 'PM' | undefined
	);

	onMount(() => {
		const interval = setInterval(() => {
			date = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<BaseWidget {widget} {isEditing}>
	{#snippet settingsDialog()}
		<ClockSettings {widget} />
	{/snippet}

	<div class="clock">
		<time datetime={date.toISOString()}>
			<span class="time-string">
				{timeString}
			</span>

			{#if widget.hour_format === '12h' && dayPeriod}
				<span class="day-period">{dayPeriod}</span>
			{/if}
		</time>

		{#if isEditing}
			<Popover bind:open={popoverOpen}>
				{#snippet trigger({ props })}
					<button class="region" {...props} aria-current={popoverOpen}>
						<Globe />

						<span class="city-country">
							{widget.city}, {widget.country}
						</span>

						<PencilSimple size={18} />
					</button>
				{/snippet}

				<TimezonePopover {widget} onselect={() => (popoverOpen = false)} />
			</Popover>
		{:else}
			<div class="region">
				<Globe />

				<span class="city-country">
					{widget.city}, {widget.country}
				</span>
			</div>
		{/if}
	</div>
</BaseWidget>

<style lang="scss">
	.clock {
		display: flex;
		flex-direction: column;
		align-items: center;

		// optical alignment since the button is technically big and has its own padding
		margin: calc(0px - var(--base-padding));
		padding-left: var(--base-padding);
		padding-right: var(--base-padding);
		padding-top: calc(var(--base-padding) * 1.25);
		padding-bottom: calc(var(--base-padding) * 0.5);
		gap: calc(var(--base-gap) * 0.25);

		time {
			color: var(--color-heading);

			.time-string {
				font-size: 3.5rem;
				font-family: var(--font-heading);
				margin-right: 0.1em;
			}

			.day-period {
				font-weight: 700;
				font-size: 1.25rem;
			}
		}

		.region {
			display: flex;
			align-items: center;

			padding-left: calc(var(--base-padding) * 0.75);
			padding-top: calc(var(--base-padding) * 0.75);
			padding-bottom: calc(var(--base-padding) * 0.75);
			padding-right: var(--base-padding);
			gap: calc(var(--base-gap) * 0.5);

			background-color: transparent;
			border: none;
			border-radius: var(--inputs-border-base-radius);
			color: var(--color-heading);

			cursor: pointer;
			text-align: left;

			&:is(button):hover,
			&[aria-current='true'] {
				backdrop-filter: brightness(0.9);
			}
		}
	}
</style>
