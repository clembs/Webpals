<script module lang="ts">
	export { aboutWebpalsDialog };
</script>

<script lang="ts">
	import BlueskyLogo from '$icons/brands/BlueskyLogo.svelte';
	import DiscordLogo from '$icons/brands/DiscordLogo.svelte';
	import GitHubLogo from '$icons/brands/GitHubLogo.svelte';
	import XLogo from '$icons/brands/XLogo.svelte';
	import Webpals from '$icons/Webpals.svelte';
	import { dialogPortal } from '$lib/components/Dialog/dialog.svelte';
	import type { CurrentProfile } from '$lib/db/types';
	import { ArrowSquareOut, Gear, SignOut, UserSquare } from 'phosphor-svelte';
	import Avatar from '../Avatar.svelte';
	import Popover from '../Popover/Popover.svelte';
	import RowItem from '../RowItem.svelte';

	let {
		profile: profile
	}: {
		profile: CurrentProfile;
	} = $props();

	let menuOpen = $state(false);
</script>

{#snippet aboutWebpalsDialog()}
	<div id="about-webpals">
		<div class="header">
			<Webpals size={64} />

			<h1>Webpals</h1>

			<p id="copyright-blurb">
				&copy; 2024-{new Date().getFullYear()} Clembs
			</p>

			<div id="version-badge">Version {WEBPALS_VERSION}</div>
		</div>

		<ul>
			<li>
				<RowItem
					leadingIcon={DiscordLogo}
					label="Discord"
					href="https://discord.gg/Mauurzxvrp"
					trailingIcon={ArrowSquareOut}
					trailingIconProps={{ weight: 'regular' }}
				/>
			</li>
			<li>
				<RowItem
					leadingIcon={GitHubLogo}
					label="Report an issue"
					href="https://github.com/Clembs/Webpals/issues"
					trailingIcon={ArrowSquareOut}
					trailingIconProps={{ weight: 'regular' }}
				/>
			</li>
		</ul>

		<ul>
			<li>
				<RowItem
					leadingIcon={BlueskyLogo}
					label="Bluesky"
					href="https://bsky.app/profile/did:plc:ywcz5zihn4hxynh6wmxk4f4y"
					trailingIcon={ArrowSquareOut}
					trailingIconProps={{ weight: 'regular' }}
				/>
			</li>
			<li>
				<RowItem
					leadingIcon={XLogo}
					label="X/Twitter"
					href="https://x.com/clembsv"
					trailingIcon={ArrowSquareOut}
					trailingIconProps={{ weight: 'regular' }}
				/>
			</li>
		</ul>
	</div>
{/snippet}

<Popover bind:open={menuOpen} contentProps={{ align: 'end' }}>
	{#snippet trigger({ props })}
		<button
			{...props}
			class="navbar-icon-button"
			aria-label="Profile"
			title="Profile"
			aria-current={menuOpen}
		>
			<Avatar {profile} size="2.5rem" />
		</button>
	{/snippet}

	<div id="account-menu">
		<div class="header">
			<Avatar {profile} size="3rem" />
			<div class="text">
				<h4>
					{profile.displayName || profile.username}
				</h4>
				<p class="paragraph">
					@{profile.username}
				</p>
			</div>
		</div>

		<ul>
			<li>
				<RowItem
					leadingIcon={UserSquare}
					leadingIconProps={{ weight: 'regular' }}
					label="My profile"
					href="/{profile.username}"
				/>
			</li>
			<li>
				<RowItem
					leadingIcon={Gear}
					leadingIconProps={{ weight: 'regular' }}
					label="Settings"
					href="/settings"
				/>
			</li>
			<li>
				<RowItem
					leadingIcon={Webpals}
					label="About Webpals"
					onclick={() => {
						dialogPortal.openDialog(aboutWebpalsDialog);
					}}
				/>
			</li>
			<li>
				<RowItem
					leadingIcon={SignOut}
					leadingIconProps={{ weight: 'regular' }}
					label="Logout"
					href="/logout"
					data-sveltekit-preload-data="off"
				/>
			</li>
		</ul>
	</div>
</Popover>

<style lang="scss">
	@use '../../../styles/mixins.scss';

	#account-menu {
		display: flex;
		flex-direction: column;

		gap: var(--base-gap);
		width: 300px;

		.header {
			display: flex;
			gap: calc(var(--base-gap) * 0.75);
		}

		ul {
			@include mixins.fancy-list;
		}
	}

	#about-webpals {
		display: flex;
		flex-direction: column;
		align-items: center;

		gap: calc(var(--base-gap) * 1.25);
		min-width: 400px;

		.header {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: calc(var(--base-gap) * 0.5);
		}

		#version-badge {
			background-color: #987fff;
			padding: calc(var(--base-padding) * 0.25) calc(var(--base-padding) * 0.75);
			align-items: center;
			height: fit-content;
			border-radius: 99px;
			color: var(--inputs-background-color);
		}

		ul {
			@include mixins.fancy-list;
		}

		@media (max-width: 768px) {
			min-width: auto;
		}
	}
</style>
