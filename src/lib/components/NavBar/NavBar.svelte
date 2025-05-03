<script lang="ts">
	import { page } from '$app/state';
	import { Bell, BellRinging, Compass } from 'phosphor-svelte';
	import Avatar from '../Avatar.svelte';
	import NotificationsMenu from './NotificationsMenu.svelte';
	import { clickoutside } from '@svelte-put/clickoutside';
	import AccountMenu from './AccountMenu.svelte';
	import { clientSupabase } from '$lib/db/supabase';
	import { onDestroy, onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import Webpals from '$icons/Webpals.svelte';
	import Button from '../Button.svelte';

	let accountMenuOpen = $state(false);
	let notificationsMenuOpen = $state(false);

	let unreadNotifications = $derived(
		page.data.currentProfile?.notifications.filter((n) => !n.read)
	);

	let supabaseChannel = $state<RealtimeChannel>();

	onMount(() => {
		supabaseChannel = clientSupabase
			.channel('notification-updates')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					table: 'notifications',
					schema: 'public',
					// TODO: figure out better security
					filter: `user_id = ${page.data.currentProfile?.id}`
				},
				(payload) => invalidate('layout:user')
			)
			.subscribe((status) => console.log('supabase realtime', status));
	});

	onDestroy(() => supabaseChannel?.unsubscribe());
</script>

<header>
	<a class="icon-button" href="/" aria-label="Home" title="Home">
		<Webpals size="2rem" />
	</a>

	<nav>
		<ul>
			<li>
				<a
					class="icon-button"
					href="/explore"
					aria-label="Explore"
					title="Explore"
					aria-current={page.url.pathname === '/explore'}
				>
					<Compass weight={page.url.pathname === '/explore' ? 'fill' : 'regular'} />
				</a>
			</li>
			{#if page.data.currentProfile}
				<li
					data-has-submenu="true"
					use:clickoutside
					onclickoutside={() => (notificationsMenuOpen = false)}
				>
					<button
						class="icon-button"
						onclick={() => (notificationsMenuOpen = !notificationsMenuOpen)}
						aria-current={notificationsMenuOpen}
						aria-label="Notifications"
						title="Notifications"
					>
						{#if unreadNotifications!.length > 0}
							<div aria-label="{unreadNotifications!.length} new notifications" class="badge">
								{unreadNotifications!.length}
							</div>
							<BellRinging weight={notificationsMenuOpen ? 'fill' : 'regular'} />
						{:else}
							<Bell weight={notificationsMenuOpen ? 'fill' : 'regular'} />
						{/if}
					</button>

					{#if notificationsMenuOpen}
						<NotificationsMenu
							bind:menuOpen={notificationsMenuOpen}
							user={page.data.currentProfile}
						/>
					{/if}
				</li>
			{/if}

			{#if page.data.currentProfile}
				<li
					id="account-menu-wrapper"
					use:clickoutside
					onclickoutside={() => (accountMenuOpen = false)}
					data-has-submenu="true"
				>
					<button
						use:clickoutside
						onclick={() => (accountMenuOpen = !accountMenuOpen)}
						aria-label="Profile"
						title="Profile"
						class="icon-button"
					>
						<Avatar user={page.data.currentProfile} size="2.5rem" />
					</button>

					{#if accountMenuOpen}
						<AccountMenu bind:menuOpen={accountMenuOpen} user={page.data.currentProfile} />
					{/if}
				</li>
			{:else}
				<li id="join-cta-wrapper">
					<Button href="/login" size="sm">Join Webpals</Button>
				</li>
			{/if}
		</ul>
	</nav>
</header>

<style lang="scss">
	:root {
		// Size of all navigation buttons within the navbar
		--navbar-button-size: 3rem;
		--navbar-padding: calc(var(--base-padding) * 0.5);
		// Calculated height of the navbar (including margins), used globally
		--navbar-height: calc(
			var(--navbar-button-size) + var(--navbar-padding) * 2 + var(--inputs-border-width) * 2 +
				var(--base-padding) * 2
		);
	}

	header {
		// Layout
		display: flex;
		justify-content: space-between;
		align-items: center;

		// Gaps, paddings, margins
		width: calc(100% - var(--base-padding) * 2);
		max-width: 60rem;
		margin: var(--base-padding) auto;
		padding: var(--navbar-padding);
		gap: var(--base-gap);

		// Visual flair
		background-color: var(--widgets-background-color);
		border: var(--widgets-border-width) solid var(--widgets-border-color);
		border-radius: calc(var(--widgets-border-base-radius) * 2);
		box-shadow: var(--widgets-box-shadow-x) var(--widgets-box-shadow-y)
			var(--widgets-box-shadow-blur) var(--widgets-box-shadow-spread)
			var(--widgets-box-shadow-color);
	}

	ul {
		display: flex;
		align-items: center;

		list-style: none;
	}

	li[data-has-submenu='true'] {
		position: relative;
	}

	.icon-button {
		display: grid;
		place-items: center;
		border-radius: 99px;
		height: var(--navbar-button-size);
		width: var(--navbar-button-size);
		background-color: transparent;
		color: var(--color-heading);
		cursor: pointer;
		border: none;
		position: relative;

		&[aria-current='true'] {
			background-color: var(--widgets-background-color-dim);
		}

		&:hover {
			backdrop-filter: brightness(0.95);
		}

		.badge {
			position: absolute;
			top: -2px;
			right: -2px;
			font-weight: bold;
			background-color: var(--color-urgent);
			color: var(--background);
			border-radius: 99px;
			display: grid;
			place-items: center;
			height: calc(var(--base-padding) * 1.25);
			width: calc(var(--base-padding) * 1.25);
			font-size: 14px;
		}
	}

	#account-menu-wrapper {
		margin-left: 0.25rem;
	}

	#join-cta-wrapper {
		margin: 0.5rem;
	}
</style>
