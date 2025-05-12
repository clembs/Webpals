<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import TextInput from '$lib/components/TextInput.svelte';

	let { data } = $props();

	let isLoading = $state(false);
</script>

<main>
	<Card min-width="500px">
		<h1>Create an account or log in</h1>
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
				label="Email or username"
				name="login"
				type="text"
				autofocus
				bind:value={data.login}
			/>

			<Button loading={isLoading} disabled={isLoading} type="submit">Continue</Button>
		</form>
	</Card>
</main>

<style lang="scss">
	main {
		display: grid;
		place-items: center;
		height: 100vh;

		h1 {
			font-size: 1.5rem;
		}

		form {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}
	}
</style>
