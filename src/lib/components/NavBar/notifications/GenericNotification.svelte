<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import type { Notification } from '$lib/db/types';
	import { Check } from 'phosphor-svelte';

	let {
		notification
	}: {
		notification: Notification;
	} = $props();
</script>

<div class="left">If you see this, you may be me. Huh?</div>

<div class="right">
	<form
		use:enhance
		action="/api/notifications?/deleteNotification&id={notification.id}"
		method="post"
	>
		<Button
			size="sm"
			variant="success"
			aria-label="Dismiss notification"
			title="Dismiss notification"
			icon={Check}
			iconProps={{ weight: 'regular' }}
			type="submit"
		/>
	</form>
</div>
