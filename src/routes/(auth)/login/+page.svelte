<script lang="ts">
	import { enhance } from '$app/forms';
	import Webpals from '$icons/Webpals.svelte';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';

	let { data } = $props();

	let isLoading = $state(false);
	let login = $state(data.login);
</script>

<div class="header">
	<Webpals size={48} />

	<h2>Create a new profile or log in to Webpals</h2>

	<p>
		By continuing, you agree to the
		<!-- TODO: add community rules lmfao -->
		<a class="link" target="_blank" href="/community-rules"> Webpals community rules </a>.
	</p>
</div>

<form
	use:enhance={() => {
		isLoading = true;
		return async ({ result, update }) => {
			isLoading = false;

			await update({
				invalidateAll: false
			});
		};
	}}
	action="?/handleAuthFlow"
	method="post"
>
	<TextInput
		autocomplete="email webauthn"
		label="Username or email"
		name="login"
		type="text"
		autofocus
		bind:value={login}
	/>

	<Button style="width: 100%;" loading={isLoading} disabled={isLoading || !login} type="submit">
		Continue
	</Button>
</form>
