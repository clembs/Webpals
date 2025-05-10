<script lang="ts">
	import AddFriend from './AddFriendButton.svelte';
	import { type Profile } from '$lib/db/types';
	import { formatDate } from '$lib/helpers/text';
	import {
		Cake,
		Circle,
		CircleDashed,
		Prohibit,
		DotsThree,
		CopySimple,
		Flag,
		ShareFat,
		Image
	} from 'phosphor-svelte';
	import BaseWidget from '../BaseWidget.svelte';
	import Button from '$lib/components/Button.svelte';
	import { HEARTBEAT_INTERVAL } from '$lib/helpers/constants';
	import { page } from '$app/state';
	import Avatar from '$lib/components/Avatar.svelte';
	import InlineTextInput from '$lib/components/InlineTextInput.svelte';
	import { enhance } from '$app/forms';
	import { toaster } from '$lib/components/Toast/toast.svelte';
	import Dropdown from '$lib/components/Dropdown/Dropdown.svelte';
	import DropdownItem from '$lib/components/Dropdown/DropdownItem.svelte';
	import { DropdownMenu } from 'bits-ui';

	let { profile, isEditing }: { profile: Profile; isEditing: boolean } = $props();

	// If the user set their status to something other than offline AND that the last heartbeat was within the IN (plus a second for safety)
	let isAlive = $derived(
		profile.status !== 'offline' &&
			profile.lastHeartbeat.getTime() > Date.now() - HEARTBEAT_INTERVAL + 1000
	);

	// form-related states
	let avatarInputEl = $state<HTMLInputElement>();
	let temporaryAvatarSrc = $state<string>();
	let displayNameValue = $state(profile.displayName || profile.username);
	let pronounsValue = $state(profile.pronouns || '');
	let formEl = $state<HTMLFormElement>();
</script>

{#snippet topProfileContents()}
	<div class="top-profile">
		{#if isEditing}
			<input
				bind:this={avatarInputEl}
				type="file"
				id="avatar-input"
				name="avatar"
				accept="image/*"
				onchange={() => {
					if (avatarInputEl && avatarInputEl.files?.length) {
						const avatar = avatarInputEl.files[0];

						if (avatar && !avatar.type.startsWith('image/')) {
							toaster.error('Only images are supported for profile pictures!');
							return;
						}

						if (avatar.size > 1024 * 1024) {
							toaster.error("Please pick an image that's less than 1 MB.");
							return;
						}

						const reader = new FileReader();

						reader.onload = () => {
							if (!reader.result) return;
							temporaryAvatarSrc = reader.result.toString();
						};
						reader.readAsDataURL(avatar);

						formEl?.requestSubmit();
					}
				}}
			/>
			<label class="avatar-stack" for="avatar-input" aria-label="Edit avatar">
				<Avatar {profile} src={temporaryAvatarSrc} />

				<div class="overlay edit-button">
					<Button
						onclick={() => avatarInputEl?.click()}
						type="button"
						variant="secondary"
						size="sm"
						icon={Image}
					/>
				</div>
			</label>
		{:else}
			<div class="avatar-stack">
				<Avatar {profile} />

				<div class="overlay">
					{#if profile.status === 'online' && isAlive}
						<Circle color="var(--color-success)" />
					{:else if profile.status === 'dnd' && isAlive}
						<Prohibit color="var(--color-urgent)" />
					{:else}
						<CircleDashed />
					{/if}
				</div>
			</div>
		{/if}

		<div class="text-bits">
			{#if isEditing}
				<InlineTextInput
					name="display-name"
					bind:value={displayNameValue}
					class="heading-2"
					maxlength={32}
					onblur={() => formEl?.requestSubmit()}
				/>
			{:else}
				<h2>
					{profile.displayName || profile.username}
				</h2>
			{/if}
			<div class="username-pronouns">
				@{profile.username}

				{#if profile.pronouns}
					<span class="bullet"> &bull; </span>

					{#if isEditing}
						<InlineTextInput
							name="pronouns"
							bind:value={pronounsValue}
							class="paragraph"
							maxlength={20}
							onblur={() => formEl?.requestSubmit()}
						/>
					{:else}
						<span class="pronouns">
							{profile.pronouns}
						</span>
					{/if}
				{/if}
			</div>
		</div>
	</div>
{/snippet}

<BaseWidget {isEditing}>
	<div class="profile-info">
		{#if isEditing}
			<form
				use:enhance={() => {
					console.log(avatarInputEl?.files?.length);

					if (
						profile.pronouns === pronounsValue &&
						(profile.displayName ?? profile.username) === displayNameValue &&
						avatarInputEl?.files &&
						avatarInputEl.files.length === 0
					) {
						return;
					}

					const toast = toaster.load('Updating profile...');

					return async ({ result, update }) => {
						if (result.type === 'success') {
							toast.success('Profile updated!');
						} else if (result.type === 'failure' && typeof result.data?.message === 'string') {
							toast.error({ title: 'Error updating your profile.', subtitle: result.data.message });
						}

						await update({
							reset: false,
							invalidateAll: true
						});
					};
				}}
				action="/api/profile?/editProfile"
				method="post"
				enctype="multipart/form-data"
				bind:this={formEl}
			>
				{@render topProfileContents()}
			</form>
		{:else}
			{@render topProfileContents()}
		{/if}

		<div class="stats">
			<div class="stat">
				<Cake />

				<div class="text">
					Joined

					<span class="darken">
						{formatDate(profile.createdAt, 'en-US')}
					</span>
				</div>
			</div>
		</div>
	</div>

	{#if page.data.currentProfile}
		<div class="actions">
			<Dropdown contentProps={{ align: 'start' }}>
				{#snippet trigger({ props })}
					<Button
						icon={DotsThree}
						iconProps={{ weight: 'regular' }}
						variant="secondary"
						aria-label="More actions"
						{...props}
					/>
				{/snippet}

				<DropdownMenu.Group aria-label="User actions">
					<DropdownItem
						icon={ShareFat}
						iconProps={{ weight: 'regular' }}
						onSelect={async () => {
							const profileUrl = `${page.url.origin}/${profile.username}`;

							if ('canShare' in navigator && navigator.canShare()) {
								await navigator.share({
									title: `Come check @${profile.username}'s Webpals profile!`,
									url: profileUrl
								});
							} else {
								await navigator.clipboard.writeText(profileUrl);
								toaster.success('Copied profile URL to clipboard!');
							}
						}}
					>
						Share
					</DropdownItem>
					<DropdownItem
						icon={CopySimple}
						iconProps={{ weight: 'regular' }}
						onSelect={async () => {
							await navigator.clipboard.writeText(profile.id);
							toaster.success('Copied user ID to clipboard!');
						}}
					>
						Copy user ID
					</DropdownItem>
					<!-- TODO: implement user reporting -->
					<DropdownItem variant="urgent" icon={Flag} disabled>Report user</DropdownItem>
				</DropdownMenu.Group>
			</Dropdown>

			<AddFriend {profile} />
		</div>
	{/if}
</BaseWidget>

<style lang="scss">
	form {
		display: contents;
	}

	.profile-info {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 0.75);
	}

	.top-profile {
		display: flex;
		gap: var(--base-gap);
		align-items: center;

		.avatar-stack {
			position: relative;

			.overlay {
				position: absolute;
				bottom: -5px;
				right: -5px;
				border-radius: 99px;
				overflow: visible;
				background-color: var(--widgets-background-color);
				border: 5px solid var(--widgets-background-color);

				&.edit-button {
					bottom: -10px;
					right: -10px;
				}
			}
		}

		.text-bits {
			display: flex;
			flex-direction: column;
		}
	}

	#avatar-input {
		display: none;
	}

	label[for='avatar-input'] {
		cursor: pointer;
		&:hover {
			filter: brightness(0.9);
		}
	}

	.stats {
		display: flex;
		flex-direction: column;
		gap: var(--base-gap);

		.stat {
			display: flex;
			gap: calc(var(--base-gap) * 0.5);
			align-items: center;

			.text {
				.darken {
					color: var(--color-heading);
				}
			}
		}
	}

	.actions {
		display: flex;
		gap: calc(var(--base-gap) * 0.5);
	}
</style>
