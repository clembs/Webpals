<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import { NotificationTypes } from '$lib/db/schema/notifications';
	import { clientSupabase } from '$lib/db/supabase';
	import { Bell, BellRinging } from 'phosphor-svelte';
	import { onMount } from 'svelte';
	import Button from '../../Button.svelte';
	import Popover from '../../Popover/Popover.svelte';
	import FriendRequestAcceptedNotification from './FriendRequestAcceptedNotification.svelte';
	import FriendRequestNotification from './FriendRequestNotification.svelte';
	import GenericNotification from './GenericNotification.svelte';

	import Webpals from '$icons/Webpals.svelte';
	import { slide } from 'svelte/transition';
	import './styles.scss';

	let menuOpen = $state(false);

	let currentProfile = $derived(page.data.currentProfile!);
	let notifications = $derived(currentProfile.notifications);
	let unreads = $derived(notifications.filter((n) => !n.read));

	onMount(() => {
		const supabaseChannel = clientSupabase
			.channel('notification-updates')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					table: 'notifications',
					schema: 'public',
					// TODO: figure out better security
					filter: `user_id = ${currentProfile.id}`
				},
				(payload) => invalidate('layout:user')
			)
			.subscribe((status) => console.log('supabase realtime', status));

		return () => supabaseChannel?.unsubscribe();
	});

	async function openMenu() {
		menuOpen = !menuOpen;
		// as a side event, if there's unreads mark them as read in the background
		if (unreads.length > 0) {
			await fetch('/api/notifications?/markAllAsRead', {
				method: 'POST',
				body: new FormData(),
				headers: {
					'x-sveltekit-action': 'true'
				}
			});
		}
	}
</script>

<Popover bind:open={menuOpen} contentProps={{ align: 'end' }}>
	{#snippet trigger({ props })}
		<button
			{...props}
			onclick={openMenu}
			class="navbar-icon-button"
			aria-label="Notifications"
			aria-current={menuOpen}
			title="Notifications"
		>
			{#if unreads.length > 0}
				<div aria-label="{unreads.length} new notifications" class="badge">
					{unreads.length}
				</div>
				<BellRinging weight={menuOpen ? 'fill' : 'regular'} />
			{:else}
				<Bell weight={menuOpen ? 'fill' : 'regular'} />
			{/if}
		</button>
	{/snippet}

	<div id="notifications-menu">
		<div class="header">
			<div class="text">
				<h3>Notifications</h3>

				<div class="counters paragraph">
					<span class="total">
						{notifications.length} total
					</span>
					{#if unreads.length > 0}
						<span class="bullet">•</span>
						<span class="unread">
							{unreads.length} new
						</span>
					{/if}
				</div>
			</div>

			<form use:enhance action="/api/notifications?/deleteAllNotifications" method="post">
				<Button disabled={notifications.length === 0} variant="secondary">Clear all</Button>
			</form>
		</div>

		{#if notifications.length > 0}
			<ul id="notification-list">
				{#each currentProfile?.notifications as notification}
					<li class="notification" data-is-new={!notification.read} out:slide>
						{#if notification.type === NotificationTypes.Generic}
							<GenericNotification {notification} />
						{:else if notification.type === NotificationTypes.FriendRequest && notification.mentionedProfiles.length}
							<FriendRequestNotification {notification} />
						{:else if notification.type === NotificationTypes.FriendRequestAccepted && notification.mentionedProfiles.length}
							<FriendRequestAcceptedNotification {notification} />
						{:else}
							Invalid notification... Report this issue to the developers via Discord, Twitter or
							Bluesky!
						{/if}
					</li>
				{/each}
			</ul>
		{:else}
			<div class="no-notifications paragraph">
				<Webpals size={32} />
				No notifications...
			</div>
		{/if}
	</div>
</Popover>

<style lang="scss">
	#notifications-menu {
		display: flex;
		flex-direction: column;
		gap: var(--base-gap);
		min-width: 330px;

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.text {
				display: flex;
				flex-direction: column;

				.bullet {
					color: var(--widgets-border-color);
				}

				.unread {
					color: var(--color-urgent);
				}
			}
		}

		#notification-list {
			display: flex;
			flex-direction: column;
			gap: calc(var(--base-gap) * 0.5);
			list-style: none;

			.notification {
				position: relative;

				&[data-is-new='true']::before {
					position: absolute;
					left: calc(0px - var(--base-padding) * 0.75);
					top: 50%;
					transform: translateY(-50%);
					content: '';
					height: 6px;
					width: 6px;
					border-radius: 999px;
					background-color: var(--color-urgent);
				}
			}
		}
	}

	.no-notifications {
		display: flex;
		align-items: center;
		justify-content: center;

		width: 100%;
		padding: var(--base-padding);
		gap: calc(var(--base-gap) * 0.75);
	}
</style>
