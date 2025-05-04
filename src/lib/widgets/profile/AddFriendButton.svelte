<script lang="ts">
	import { type Profile } from '$lib/db/types';
	import { Prohibit, UserPlus, Clock, Users } from 'phosphor-svelte';
	import Button from '$lib/components/Button.svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { RelationshipTypes } from '$lib/db/schema/profiles';

	let { profile }: { profile: Profile } = $props();
	let addFriendState = $state<null | 'loading' | 'error'>(null);

	let relationship = $derived(
		page.data.currentProfile?.initiatedRelationships.find(
			(relationship) => relationship.recipientId === profile.id
		)?.status
	);
</script>

<!-- TODO: Add toast messages -->

{#if relationship === RelationshipTypes.FriendPending}
	<!-- TODO: remove request -->
	<Button style="flex: 1;" icon={Clock} variant="secondary" disabled>Requested</Button>
{:else if relationship === RelationshipTypes.Friend}
	<!-- TODO: unfriend -->
	<Button style="flex: 1;" icon={Users} variant="secondary">Friends</Button>
{:else if relationship === RelationshipTypes.Blocked}
	<!-- TODO: unblock -->
	<Button style="flex: 1;" icon={Prohibit} variant="secondary">Blocked</Button>
{:else}
	<form
		use:enhance={() => {
			addFriendState = 'loading';
			return async ({ result, update }) => {
				if (result.type === 'error' || result.type === 'failure') {
					addFriendState = 'error';
				}
				addFriendState = null;
				await update();
			};
		}}
		style="display: contents;"
		action="/api/relationships?/sendFriendRequest&id={profile.id}"
		method="post"
	>
		<Button
			type="submit"
			style="flex: 1;"
			icon={UserPlus}
			loading={addFriendState === 'loading'}
			disabled={(page.data.currentProfile && page.data.currentProfile.id === profile.id) ||
				addFriendState !== null}
		>
			Add friend
		</Button>
	</form>
{/if}
