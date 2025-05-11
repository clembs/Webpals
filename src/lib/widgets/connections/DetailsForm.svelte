<script lang="ts">
	import TextInput from '$lib/components/TextInput.svelte';
	import type { FormEventHandler } from 'svelte/elements';
	import type { ConnectionProviderData } from './connection-providers';
	import ConnectionComponent from './ConnectionComponent.svelte';
	import { parseIdentifiableUrl } from './helpers';

	let {
		oninput,
		identifiable = $bindable(''),
		label = $bindable(''),
		provider
	}: {
		oninput?: FormEventHandler<HTMLInputElement>;
		identifiable?: string;
		label?: string;
		provider: ConnectionProviderData | undefined;
	} = $props();
</script>

<TextInput
	name="connection-identifiable"
	label={provider?.identifiableInputLabel}
	placeholder={provider?.identifiableInputPlaceholder ??
		(provider?.identifiablePrefix ? `what comes after ${provider?.identifiablePrefix}` : '')}
	bind:value={identifiable}
	maxlength={32}
	required={false}
	{oninput}
/>

<TextInput
	name="connection-label"
	label="Label (optional)"
	placeholder="What does this connection represent?"
	bind:value={label}
	maxlength={32}
	required={false}
	{oninput}
/>

{#if provider && identifiable}
	<div id="connection-preview">
		<h4>Preview</h4>

		<div id="connection-preview-wrapper" inert>
			<ConnectionComponent
				connection={{
					id: '',
					identifiable,
					label,
					profileId: '',
					provider: provider.id,
					url: parseIdentifiableUrl(provider, identifiable) || null,
					verified: false
				}}
				isEditing={false}
			/>
		</div>
	</div>
{/if}

<style lang="scss">
	#connection-preview {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 0.75);

		#connection-preview-wrapper {
			overflow: hidden;
			border-radius: var(--inputs-border-base-radius);
			background-color: var(--widgets-background-color-dim);
		}
	}
</style>
