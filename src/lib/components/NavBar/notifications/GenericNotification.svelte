<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import type { Notification } from '$lib/db/types';
	import { Check } from 'phosphor-svelte';
	import DismissButton from './DismissButton.svelte';

	let {
		notification
	}: {
		notification: Notification;
	} = $props();
</script>

<div class="notification-details">
	<div class="content">If you see this, you may be me. Huh?</div>

	<DismissButton notificationId={notification.id} />
</div>
