<script>
	import TextInput from '$lib/components/TextInput.svelte';
	import { At, Info, ThumbsUp, Warning } from 'phosphor-svelte';
</script>

<section>
	<h3>Standard inputs</h3>

	<div class="flex">
		<TextInput label="Label" placeholder="No icon" />

		<TextInput
			label="Label"
			placeholder="Icon, max length"
			icon={ThumbsUp}
			iconProps={{ weight: 'regular' }}
			maxlength={40}
		/>
	</div>
</section>

<section>
	<h3>With supporting text/errors</h3>

	<div class="flex">
		<TextInput label="Label" placeholder="Supporting text" icon={Info}>
			{#snippet supportingText()}
				Supporting text. <a href="#e" class="link">Learn more</a>.
			{/snippet}
		</TextInput>

		<TextInput label="Label" placeholder="Error message" icon={Warning} maxlength={30}>
			{#snippet error()}
				Incredible errors!
			{/snippet}
		</TextInput>
	</div>
</section>

<section>
	<h3>Disabled/readonly inputs</h3>

	<div class="flex">
		<TextInput
			label="Label"
			placeholder="Icon"
			icon={ThumbsUp}
			iconProps={{ weight: 'regular' }}
			readonly
			value="Readonly input"
		></TextInput>

		<TextInput
			label="Label"
			placeholder="Icon"
			icon={At}
			iconProps={{ weight: 'regular' }}
			disabled
			value="Disabled input with an error"
		>
			{#snippet error()}
				Error
			{/snippet}
		</TextInput>
	</div>
</section>
