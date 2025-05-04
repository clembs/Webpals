<script lang="ts">
	import AddFriend from './AddFriendButton.svelte';
	import { type Profile } from '$lib/db/types';
	import { formatDate } from '$lib/helpers/text';
	import { Cake, Circle, CircleDashed, Prohibit, DotsThree } from 'phosphor-svelte';
	import BaseWidget from '../BaseWidget.svelte';
	import Button from '$lib/components/Button.svelte';
	import { HEARTBEAT_INTERVAL } from '$lib/helpers/constants';
	import { page } from '$app/state';
	import Avatar from '$lib/components/Avatar.svelte';
	import InlineTextInput from '$lib/components/InlineTextInput.svelte';
	import { enhance } from '$app/forms';

	let { profile, editing }: { profile: Profile; editing: boolean } = $props();
	let avatarInputEl = $state<HTMLInputElement>();
	let temporaryAvatarSrc = $state<string>();

	let error = $state<string>();

	// If the user set their status to something other than offline AND that the last heartbeat was within the IN (plus a second for safety)
	let isAlive = $derived(
		profile.status !== 'offline' &&
			profile.lastHeartbeat.getTime() > Date.now() - HEARTBEAT_INTERVAL + 1000
	);

	let displayNameValue = $state(profile.displayName || profile.username);
	let pronounsValue = $state(profile.pronouns || '');
	let formEl = $state<HTMLFormElement>();
</script>

{#snippet topProfileContents()}
	<div class="top-profile">
		<div class="avatar-status">
			<Avatar user={profile} />

			<div class="status">
				{#if profile.status === 'online' && isAlive}
					<Circle color="var(--color-success)" />
				{:else if profile.status === 'dnd' && isAlive}
					<Prohibit color="var(--color-urgent)" />
				{:else}
					<CircleDashed />
				{/if}
			</div>
		</div>

		<div class="text-bits">
			{#if editing}
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
			<p class="username-pronouns">
				@{profile.username}

				{#if profile.pronouns}
					<span class="bullet"> &bull; </span>

					{#if editing}
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
			</p>
		</div>
	</div>
{/snippet}

<BaseWidget {editing}>
	<!-- {#snippet editMenu()}
		<form
			use:enhance={() => {
				error = '';
				isLoading = true;

				return ({ update, result }) => {
					if (result.type === 'failure' && typeof result.data?.message === 'string') {
						error = result.data.message;
						return;
					}

					update({ reset: false, invalidateAll: true });
					modalOpened = false;
					isLoading = false;
				};
			}}
			class="update-profile"
			enctype="multipart/form-data"
			method="post"
			action="/api/profile?/editProfile"
		>
			<div class="important-stuff">
				<input
					bind:this={avatarInputEl}
					type="file"
					id="avatar"
					name="avatar"
					accept="image/*"
					onchange={() => {
						if (avatarInputEl && avatarInputEl.files?.length) {
							const avatar = avatarInputEl.files[0];

							if (avatar && !avatar.type.startsWith('image/')) {
								error = 'Please pick an image file for your avatar.';
							}

							if (avatar.size > 1024 * 1024) {
								error = "Please pick an avatar image that's less than 1MB.";
								return;
							}

							const reader = new FileReader();

							reader.onload = () => {
								if (!reader.result) return;
								temporaryAvatarSrc = reader.result.toString();
							};
							reader.readAsDataURL(avatar);
						}
					}}
				/>
				<label for="avatar" aria-label="Edit avatar">
					<span class="hover-text">
						<PencilSimple />
					</span>
					<Avatar user={profile} src={temporaryAvatarSrc} />
				</label>
		</form>
	{/snippet} -->
	<div class="profile-info">
		{#if editing}
			<form
				use:enhance={() => {
					if (
						profile.pronouns === pronounsValue &&
						(profile.displayName ?? profile.username) === displayNameValue
					) {
						console.log('no updates');
						return;
					}

					// TODO: add toast messages for success/error

					return async ({ result, update }) => {
						console.log(result);

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
			<!-- TODO: more options menu -->
			<Button icon={DotsThree} iconProps={{ weight: 'regular' }} variant="secondary" />

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

		.avatar-status {
			position: relative;

			.status {
				position: absolute;
				bottom: 0;
				right: 0;
			}
		}

		.text-bits {
			display: flex;
			flex-direction: column;
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
