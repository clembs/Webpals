<script lang="ts">
	import { enhance } from '$app/forms';
	import Avatar from '$lib/components/Avatar.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { Notification } from '$lib/db/types';
	import { Check } from 'phosphor-svelte';

	let {
		notification
	}: {
		notification: Notification;
	} = $props();

	let recipient = $derived(notification.mentionedProfiles[0].profile!);
</script>

<div class="left">
	<a href="/{recipient.username}">
		<Avatar user={recipient} size="48px" />
	</a>

	<div class="text">
		<a href="/{recipient.username}">
			@{recipient.username}
		</a>
		<span class="subtext">has accepted your friend request!</span>
	</div>
</div>

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
