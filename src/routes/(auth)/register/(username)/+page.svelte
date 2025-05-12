<script lang="ts">
	import { enhance } from '$app/forms';
	import { replaceState } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { USERNAME_REGEX } from '$lib/helpers/constants';
	import { ArrowLeft, At } from 'phosphor-svelte';

	let { data: initialData, form } = $props();
	let isLoading = $state(false);

	// do that so you can bind the value to the input
	let data = $state(initialData);
</script>

<div class="back">
	<Button href="/login" variant="text" icon={ArrowLeft} iconProps={{ weight: 'regular' }} />
</div>

<div class="header">
	<h2>What's your online username?</h2>

	<p>
		This shouldn't be your real name! Pick something short & sweet, using underscores and periods.
	</p>
</div>

<form
	use:enhance={() => {
		isLoading = true;
		return ({ update }) => {
			isLoading = false;
			update({ reset: false });
		};
	}}
	method="post"
	action="?/validateUsername&email={data.email}"
>
	<TextInput
		name="username"
		oninput={() => {
			form = { message: '' };
			replaceState(`?username=${data.username}${data.email ? `&email=${data.email}` : ''}`, {});
		}}
		label="Username"
		placeholder="Clembs"
		minlength={2}
		maxlength={32}
		pattern={USERNAME_REGEX.source}
		icon={At}
		iconProps={{ weight: 'regular' }}
		tabindex={1}
		autofocus
		bind:value={data.username}
		error={form?.message}
	/>

	<div class="buttons">
		<Button loading={isLoading} type="submit" tabindex={2} disabled={isLoading}>Continue</Button>
	</div>
</form>
