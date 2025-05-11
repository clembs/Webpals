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

	function moveSteps() {
		const stepWidth = stepsWrapperEl!.clientWidth;

		stepsWrapperEl!.scroll({
			left: stepWidth * currentStep,
			behavior: 'smooth'
		});

		// stepsWrapperEl!.style.height = `${stepsWrapperEl!.clientHeight}px`;
		makeInert();
		recalculateStepperHeight();
	}

	function makeInert() {
		const currentStepEl = stepsWrapperEl!.children[currentStep];

		Array.from(stepsWrapperEl!.children).forEach((stepEl) => {
			(stepEl as HTMLDivElement).inert = !stepEl.isSameNode(currentStepEl);
		});
	}

	// smoothly animate the height of the dialog
	function recalculateStepperHeight() {
		requestAnimationFrame(() => {
			const currentStepEl = stepsWrapperEl!.children[currentStep];
			stepsWrapperEl!.style.height = `${currentStepEl.clientHeight}px`;
		});
	}

	onMount(() => {
		makeInert();
		recalculateStepperHeight();
	});
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
	}
</style>
