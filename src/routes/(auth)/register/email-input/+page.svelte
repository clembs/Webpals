<script lang="ts">
	import { enhance } from '$app/forms';
	import { replaceState } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { ArrowLeft, Envelope } from 'phosphor-svelte';

	let { data: initialData, form } = $props();

	// do that so you can bind the value to the input
	let data = $state(initialData);

	let isLoading = $state(false);
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
	<h2>Verify your email address</h2>

	<p>To combat spam and secure your account, your email address needs to be verified.</p>
</div>

<form
	use:enhance={() => {
		isLoading = true;
		return ({ update }) => {
			isLoading = false;
			update({ reset: false });
		};
	}}
	action="?/validateEmail"
	method="post"
>
	<TextInput
		name="email"
		oninput={() => replaceState(`?username=${data.username}&email=${data.email}`, {})}
		type="email"
		label="Email address"
		placeholder="clembs@clembs.com"
		autocomplete="email"
		icon={Envelope}
		iconProps={{ weight: 'regular' }}
		bind:value={data.email}
		error={form?.message}
		autofocus
	/>

	<div class="buttons">
		<Button type="submit" loading={isLoading} disabled={isLoading}>Send verification code</Button>
	</div>
</form>
