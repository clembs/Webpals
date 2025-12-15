<script lang="ts">
	let { children } = $props();
</script>

<main>
	<div class="card">
		{@render children()}
	</div>
</main>

<style lang="scss">
	@use '../../styles/mixins.scss';

	main {
		background-image: linear-gradient(180deg, var(--plain-90), var(--plain-60));
		display: grid;
		place-items: center;
		min-height: 100vh;

		.card {
			@include mixins.card;

			position: relative;

			max-width: 30rem;
			padding: calc(var(--base-padding) * 1.5);
			gap: calc(var(--base-gap) * 1.5);

			:global(.header) {
				display: flex;
				flex-direction: column;
				align-items: center;

				gap: calc(var(--base-gap) * 0.75);
				text-align: center;
				text-wrap: balance;
			}

			:global(form) {
				display: flex;
				flex-direction: column;
				gap: var(--base-gap);
			}

			:global(.buttons) {
				display: flex;
				flex-direction: column;
				gap: calc(var(--base-gap) * 0.25);
			}

			:global(.back) {
				position: absolute;
				left: var(--base-padding);
				top: var(--base-padding);
			}
		}
	}
</style>
