<script lang="ts">
	import { page } from '$app/state';

	let { children } = $props();

	const steps = [
		'/register',
		'/register/verify-invite-code',
		'/register/email-input',
		'/register/verify-otp'
	];

	let currentStep = $derived(steps.indexOf(page.url.pathname));
</script>

<div
	id="progress-dots"
	aria-valuemin={1}
	aria-valuenow={currentStep + 1}
	aria-valuemax={steps.length}
>
	{#each steps as _, index (index)}
		<div class="dot" aria-current={index === currentStep}></div>
	{/each}
</div>

{@render children()}

<style lang="scss">
	#progress-dots {
		display: flex;
		align-items: center;
		justify-content: center;

		width: 100%;
		gap: calc(var(--base-gap) * 0.25);
		padding: calc(var(--base-padding) * 0.75);

		.dot {
			height: 8px;
			width: 8px;
			border-radius: 4px;
			background-color: var(--inputs-border-color);
			transition:
				background-color 200ms,
				width 200ms;

			&[aria-current='true'] {
				width: 24px;
				background-color: var(--buttons-primary-background-color);
			}
		}
	}
</style>
