<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { toaster } from '$lib/components/Toast/toast.svelte';
	import { X } from 'phosphor-svelte';

	let { notificationId }: { notificationId: string } = $props();
	let isLoading = $state(false);
</script>

<form
	use:enhance={() => {
		isLoading = true;

		return async ({ result, update }) => {
			isLoading = false;

			if (result.type === 'failure' && typeof result.data?.message === 'string') {
				toaster.error({
					title: 'Error while dismissing notification',
					subtitle: `ID: ${notificationId}, message: ${result.data.message}`
				});
			}

			if (result.type === 'error' && result.error) {
				toaster.error({
					title: 'Error while dismissing notification',
					subtitle: `ID: ${notificationId}, message: ${result.error}`
				});
			}

			await update();
		};
	}}
	action="/api/notifications?/deleteNotification&id={notificationId}"
	method="post"
>
	<Button
		size="sm"
		variant="secondary"
		aria-label="Dismiss notification"
		title="Dismiss notification"
		loading={isLoading}
		disabled={isLoading}
		icon={X}
		iconProps={{ weight: 'regular' }}
		type="submit"
	/>
</form>
