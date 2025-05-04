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

{#if relationship === RelationshipTypes.FriendPending}
	<!-- TODO: remove request -->
	<Button icon={Clock} variant="secondary" disabled>Requested</Button>
{:else if relationship === RelationshipTypes.Friend}
	<!-- TODO: unfriend -->
	<Button icon={Users} variant="secondary">Friends</Button>
{:else if relationship === RelationshipTypes.Blocked}
	<!-- TODO: unblock -->
	<Button icon={Prohibit} variant="secondary">Blocked</Button>
{:else}
	<form
		use:enhance={() => {
			addFriendState = 'loading';
			return async ({ result, update }) => {
				await update();
				if (result.type === 'error' || result.type === 'failure') {
					addFriendState = 'error';
				}
				addFriendState = null;
			};
		}}
		style="display: contents;"
		action="/api/relationships?/sendFriendRequest&id={profile.id}"
		method="post"
	>
		<Button
			type="submit"
			icon={UserPlus}
			loading={addFriendState === 'loading'}
			disabled={(page.data.currentProfile && page.data.currentProfile.id === profile.id) ||
				addFriendState !== null}
		>
			Add friend
		</Button>
	</form>
{/if}
