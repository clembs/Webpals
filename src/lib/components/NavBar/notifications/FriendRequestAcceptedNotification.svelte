<script lang="ts">
	import { enhance } from '$app/forms';
	import Avatar from '$lib/components/Avatar.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { Notification } from '$lib/db/types';
	import { X } from 'phosphor-svelte';
	import DismissButton from './DismissButton.svelte';

	let {
		notification
	}: {
		notification: Notification;
	} = $props();

	let recipient = $derived(notification.mentionedProfiles[0].profile!);
</script>

<div class="notification-details">
	<div class="content">
		<a href="/{recipient.username}">
			<Avatar profile={recipient} size="48px" />
		</a>

		<div class="text">
			<h4 class="clickable">Friend Request Accepted</h4>
			<p>
				<a class="link" href="/{recipient.username}">
					@{recipient.username}
				</a>
				has accepted your friend request!
			</p>
		</div>
	</div>

	<DismissButton notificationId={notification.id} />
</div>
