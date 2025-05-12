<script lang="ts">
	import { enhance } from '$app/forms';
	import TextInput from '$lib/components/TextInput.svelte';
	import type { CityData } from 'city-timezones';
	import { Globe, WarningOctagon } from 'phosphor-svelte';
	import type { ClockJSON } from '../types';
	import { onMount } from 'svelte';
	import Spinner from '$icons/Spinner.svelte';

	let { widget, onselect }: { widget: ClockJSON; onselect?: () => void } = $props();

	let date = $state(new Date());

	// search related states
	let searchQuery = $state(`${widget.city}, ${widget.country}`);
	let isLoading = $state(false);
	let error = $state('');
	// debounce timer for searching
	let timer = $state<Timer | number>();
	let searchFormEl = $state<HTMLFormElement>();
	let cities = $state<CityData[]>([]);

	onMount(() => {
		const interval = setInterval(() => {
			date = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="step-timezone">
	<form
		use:enhance={({ cancel }) => {
			if (searchQuery.length <= 2) {
				cancel();
				return;
			}

			isLoading = true;
			cities = [];

			return async ({ update, result }) => {
				isLoading = false;

				if (
					result.type === 'success' &&
					result.data &&
					'cities' in result.data &&
					Array.isArray(result.data.cities)
				) {
					cities = result.data.cities;
				} else if (
					result.type === 'failure' &&
					result.data &&
					'message' in result.data &&
					typeof result.data.message === 'string'
				) {
					error = 'No results found. Try a bigger city or the name of your country.';
				}

				await update({ reset: false });
			};
		}}
		action="/api/search/places"
		method="post"
		bind:this={searchFormEl}
	>
		<TextInput
			label="Location (City, country)"
			placeholder="Search timezones to set the clock"
			name="query"
			bind:value={searchQuery}
			icon={Globe}
			oninput={() => {
				error = '';

				if (searchQuery.length <= 2) return;

				// debounce results
				clearTimeout(timer);
				timer = setTimeout(() => {
					searchFormEl?.requestSubmit();
				}, 500);
			}}
		/>
	</form>

	{#if isLoading}
		<p class="message">
			<Spinner /> Loading cities...
		</p>
	{:else if cities.length}
		<ul class="cities">
			{#each cities as city}
				<li>
					<form
						use:enhance={() => {
							onselect?.();
						}}
						action="/api/profile?/editClockTimezone"
						method="post"
					>
						<input type="hidden" name="city" value={city.city} />

						<button type="submit">
							<div class="trailing">
								<div class="clickable">
									{city.city}, {city.country}
								</div>

								<div class="footnote">
									{new Intl.DateTimeFormat('en-US', {
										timeZoneName: 'shortOffset',
										timeZone: city.timezone
									})
										.formatToParts(date)
										.find(({ type }) => type === 'timeZoneName')?.value}
								</div>
							</div>

							<time class="headline" datetime={date.toISOString()}>
								{date.toLocaleTimeString('en-US', {
									hour: 'numeric',
									minute: 'numeric',
									timeZone: city.timezone,
									hour12: widget.hour_format === '12h',
									...(widget.show_seconds ? { second: 'numeric' } : {})
								})}
							</time>
						</button>
					</form>
				</li>
			{/each}
		</ul>
	{:else if error}
		<p class="message error">
			<WarningOctagon />
			{error}
		</p>
	{/if}
</div>

<style lang="scss">
	@use '../../../styles/mixins.scss';

	.step-timezone {
		display: flex;
		flex-direction: column;

		width: 400px;
		gap: var(--base-gap);
	}

	.cities {
		@include mixins.fancy-list;
		color: var(--color-heading);
		max-height: 200px;
		overflow-y: scroll;
	}

	form {
		display: contents;
	}

	li button {
		display: flex;
		justify-content: space-between;
		align-items: center;

		padding: var(--base-padding);
		gap: var(--base-gap);
		width: 100%;

		cursor: pointer;
		background-color: transparent;

		appearance: none;
		border: none;
		text-align: left;

		.trailing {
			display: flex;
			flex-direction: column;
		}

		&:hover {
			backdrop-filter: brightness(0.9);
		}

		time {
			white-space: nowrap;
		}
	}

	.message {
		display: flex;
		gap: calc(var(--base-gap) * 0.5);
		align-items: center;
		justify-content: center;

		&.error {
			color: var(--color-urgent);
		}
	}
</style>
