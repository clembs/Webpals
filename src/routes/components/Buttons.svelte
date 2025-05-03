<script>
	import Button from '$lib/components/Button.svelte';
	import { Heart } from 'phosphor-svelte';
</script>

<section>
	<h3>Label types</h3>

	<div class="flex">
		<Button>Button</Button>

		<Button href="#" icon={Heart}>Link button with icon</Button>

		<Button icon={Heart} />
	</div>
</section>

<section>
	<h3>Variants</h3>

	<div class="flex">
		<Button variant="secondary">Secondary</Button>

		<Button variant="text">Text</Button>

		<Button variant="success">Success</Button>

		<Button variant="urgent">Urgent</Button>
	</div>
</section>

<section>
	<h3>Small buttons</h3>

	<div class="flex">
		<Button size="sm">Small</Button>

		<Button size="sm" icon={Heart}>Small with icon</Button>

		<Button size="sm" icon={Heart} aria-label="Small (icon only)" />
	</div>
</section>

<section>
	<h3>Disabled buttons</h3>

	<div class="flex">
		<Button disabled>Disabled</Button>

		<Button disabled variant="secondary" icon={Heart}>Disabled secondary with icon</Button>

		<Button
			disabled
			variant="urgent"
			size="sm"
			icon={Heart}
			aria-label="Disabled urgent small (icon only)"
		/>
	</div>
</section>
