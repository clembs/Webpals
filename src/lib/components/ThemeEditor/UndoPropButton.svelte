<script lang="ts" generics="T">
	import { ArrowUUpLeft } from 'phosphor-svelte';
	import Button from '../Button.svelte';

	let {
		value = $bindable(),
		initialValue = $bindable()
	}: {
		value: T;
		initialValue: T;
	} = $props();
</script>

<Button
	icon
	inline
	size="small"
	variant="link"
	aria-label="Undo property to saved value"
	onclick={() => (value = initialValue)}
>
	<ArrowUUpLeft size={18} weight="regular" />
</Button>
