<script lang="ts">
	import { page } from '$app/state';
	import { Compass } from 'phosphor-svelte';
	import Avatar from '../Avatar.svelte';
	import NotificationsMenu from './notifications/NotificationsMenu.svelte';
	import { clickoutside } from '@svelte-put/clickoutside';
	import AccountMenu from './AccountMenu.svelte';
	import Webpals from '$icons/Webpals.svelte';
	import Button from '../Button.svelte';

	let accountMenuOpen = $state(false);
</script>

<header>
	<a class="icon-button" href="/" aria-label="Home" title="Home">
		<Webpals size="2rem" />
	</a>

	<nav>
		<ul>
			<li>
				<a
					class="navbar-icon-button"
					href="/explore"
					aria-label="Explore"
					title="Explore"
					aria-current={page.url.pathname === '/explore'}
				>
					<Compass weight={page.url.pathname === '/explore' ? 'fill' : 'regular'} />
				</a>
			</li>

			{#if page.data.currentProfile}
				<li data-has-submenu="true">
					<NotificationsMenu />
				</li>

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
						class="navbar-icon-button"
					>
						<Avatar profile={page.data.currentProfile} size="2.5rem" />
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

	// li[data-has-submenu='true'] {
	// 	position: relative;
	// }

	:global(.navbar-icon-button) {
		// Layout
		display: grid;
		place-items: center;

		// Gaps, paddings, margins
		height: var(--navbar-button-size);
		width: var(--navbar-button-size);

		// Visual flair
		border-radius: 99px;
		background-color: transparent;
		color: var(--color-heading);

		// Misc
		cursor: pointer;
		border: none;
		position: relative;

		// Hover state
		&:hover {
			backdrop-filter: brightness(0.95);
		}

		// If the item has a submenu & is selected
		&:global([aria-current='true']) {
			background-color: var(--widgets-background-color-dim);

			&:hover {
				filter: brightness(0.95);
			}
		}

		:global(.badge) {
			// Layout & position
			display: grid;
			place-items: center;
			position: absolute;
			bottom: -2px;
			right: -2px;

			// Gaps, paddings, margins
			height: calc(var(--base-padding) * 1.25);
			width: calc(var(--base-padding) * 1.25);

			// Visual flair
			background-color: var(--color-urgent);
			color: var(--background);
			border-radius: 99px;

			// Typography
			font-weight: 700;
			font-size: 0.875rem;
		}
	}

	#account-menu-wrapper {
		margin-left: 0.25rem;
	}

	#join-cta-wrapper {
		margin: 0.5rem;
	}
</style>
