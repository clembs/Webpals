<!-- <script lang="ts">
	import type { CurrentProfile } from '$lib/db/types';
	import type { User } from '@supabase/supabase-js';
	import AccountSettings from '../(app)/settings/account/AccountSettings.svelte';
	import BaseEditBarMenu from './BaseEditBarMenu.svelte';

	let {
		profile,
		currentUser,
		menuOpen = $bindable(false),
		editBarEl,
		editBarWrapperEl
	}: {
		profile: CurrentProfile;
		currentUser: User;
		menuOpen: boolean;
		editBarEl: HTMLDivElement | undefined;
		editBarWrapperEl: HTMLDivElement | undefined;
	} = $props();
</script>

<BaseEditBarMenu
icon={}
	label="Account settings"
	{editBarEl}
	{editBarWrapperEl}
	bind:open={menuOpen}
>
	<AccountSettings
		data={{
			currentProfile: profile,
			currentUser
		}}
	/>
</BaseEditBarMenu> -->
