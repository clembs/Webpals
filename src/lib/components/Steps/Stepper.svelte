<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	let {
		currentStep = $bindable(0),
		steps
	}: {
		currentStep?: number;
		steps: Snippet<
			[
				{
					currentStep: number;
					previousStep: () => void;
					nextStep: () => void;
					recalculateStepperHeight: () => void;
				}
			]
		>;
	} = $props();

	let stepsWrapperEl = $state<HTMLDivElement>();

	function nextStep() {
		currentStep++;
		moveSteps();
	}

	function previousStep() {
		currentStep--;
		moveSteps();
	}

	function moveSteps({ smooth } = { smooth: true }) {
		const stepWidth = stepsWrapperEl!.clientWidth;
		const currentStepEl = stepsWrapperEl!.children[currentStep];

		// scroll to current step
		stepsWrapperEl!.scroll({
			left: stepWidth * currentStep,
			behavior:
				smooth && matchMedia('(prefers-reduced-motion: no-preference)') ? 'smooth' : 'instant'
		});

		// make all steps (except current step) inert
		Array.from(stepsWrapperEl!.children).forEach((stepEl) => {
			(stepEl as HTMLDivElement).inert = !stepEl.isSameNode(currentStepEl);
		});

		recalculateStepperHeight();
	}

	// smoothly animate the height of the dialog
	function recalculateStepperHeight() {
		requestAnimationFrame(() => {
			const currentStepEl = stepsWrapperEl!.children[currentStep];
			stepsWrapperEl!.style.height = `${currentStepEl.clientHeight}px`;
		});
	}

	onMount(() => moveSteps({ smooth: false }));
</script>

<div bind:this={stepsWrapperEl} role="tablist" data-current-step={currentStep}>
	{@render steps({ currentStep, nextStep, previousStep, recalculateStepperHeight })}
</div>

<style lang="scss">
	[role='tablist'] {
		display: flex;
		flex-direction: row;
		gap: 0;
		overflow: hidden;
		transition: height 300ms ease;

		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}
	}
</style>
