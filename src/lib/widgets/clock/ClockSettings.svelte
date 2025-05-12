<script lang="ts">
	import Switch from '$lib/components/Switch.svelte';
	import { enhance } from '$app/forms';
	import type { ClockJSON } from '../types';
	import { toaster } from '$lib/components/Toast/toast.svelte';

	let { widget }: { widget: ClockJSON } = $props();

	let formEl = $state<HTMLFormElement>();
</script>

<div class="step-options">
	<h1>Clock Settings</h1>

	<form
		use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'failure' && typeof result.data?.message === 'string') {
					toaster.toast('An unexpected error happened, sorry :(');
				}

				await update({ reset: false, invalidateAll: true });
			};
		}}
		bind:this={formEl}
		action="/api/profile?/editClockOptions"
		method="post"
	>
		<label for="show-seconds" class="headline">
			Show seconds

			<Switch
				required={false}
				name="show-seconds"
				onchange={() => formEl?.requestSubmit()}
				checked={widget.show_seconds}
			/>
		</label>
		<label for="24-hour-format" class="headline">
			24-hour format

			<Switch
				required={false}
				name="24-hour-format"
				onchange={() => formEl?.requestSubmit()}
				checked={widget.hour_format === '24h'}
			/>
		</label>
	</form>
</div>

<style lang="scss">
	.step-options {
		display: flex;
		flex-direction: column;
		gap: var(--base-gap);
		min-width: 500px;

		form {
			display: contents;
		}

		label {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: var(--base-gap);
			cursor: pointer;
		}
	}
</style>
