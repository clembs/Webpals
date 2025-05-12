<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import PinInput from '$lib/components/PinInput.svelte';
	import { REGEXP_ONLY_DIGITS } from 'bits-ui';
	import { ArrowLeft, Envelope } from 'phosphor-svelte';

	let { data } = $props();

	let isLoading = $state(false);
	let formEl = $state<HTMLFormElement>();
</script>

<div class="back">
	<Button
		href="/login?login={data.login}"
		variant="text"
		icon={ArrowLeft}
		iconProps={{ weight: 'regular' }}
	/>
</div>

<div class="header">
	<Envelope weight="regular" size={48} />

	<h2>Check your email for a 6-digit code</h2>

	<p>We've sent a login code to your inbox, be patient and check your spam folders!</p>
</div>

<form
	use:enhance={() => {
		isLoading = true;
		return async ({ update }) => {
			isLoading = false;

			await update({ reset: false });
		};
	}}
	action="?/verifyOTP"
	method="post"
	bind:this={formEl}
>
	<PinInput
		name="otp"
		label="Login code"
		onComplete={() => formEl?.requestSubmit()}
		pattern={REGEXP_ONLY_DIGITS}
		maxlength={6}
		autofocus
	/>

	<div class="buttons">
		<Button type="submit" loading={isLoading} disabled={isLoading}>Log in</Button>
	</div>
</form>
