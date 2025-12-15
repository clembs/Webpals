<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import PinInput from '$lib/components/PinInput.svelte';
	import { REGEXP_ONLY_DIGITS } from 'bits-ui';
	import { ArrowLeft } from 'phosphor-svelte';

	let { data } = $props();

	let isLoading = $state(false);
	let formEl = $state<HTMLFormElement>();
</script>

<div class="back">
	<Button
		href="/register/email-input?username={data.username}&email={data.email}"
		variant="text"
		icon={ArrowLeft}
		iconProps={{ weight: 'regular' }}
	/>
</div>

<div class="header">
	<h2>Verify your email address</h2>

	<p>
		The verification code has been sent to your inbox. Type it below to verify your email address.
	</p>
</div>

<form
	use:enhance={() => {
		isLoading = true;
		return ({ update }) => {
			update({ reset: false });
			isLoading = false;
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
		<Button type="submit" loading={isLoading} disabled={isLoading}>Verify email address</Button>
	</div>
</form>
