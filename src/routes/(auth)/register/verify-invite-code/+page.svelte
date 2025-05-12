<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import PinInput from '$lib/components/PinInput.svelte';
	import { ArrowLeft } from 'phosphor-svelte';

	let { data } = $props();

	let isLoading = $state(false);
	let formEl = $state<HTMLFormElement>();
</script>

<div class="back">
	<Button
		href="/register?username={data.username}{data.email ? `&email=${data.email}` : ''}"
		variant="text"
		icon={ArrowLeft}
		iconProps={{ weight: 'regular' }}
	/>
</div>

<div class="header">
	<h2>Enter your invite code</h2>

	<p>
		Until Webpals releases, an invite code is required to register.<br />
		Please enter the 5 characters-long code you were given.
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
	action="?/validateInviteCode"
	method="post"
	bind:this={formEl}
>
	<PinInput
		name="invite-code"
		label="Invite code"
		onComplete={() => formEl?.requestSubmit()}
		maxlength={5}
		autofocus
	/>

	<div class="buttons">
		<Button loading={isLoading} disabled={isLoading} type="submit">Verify invite code</Button>
	</div>
</form>
