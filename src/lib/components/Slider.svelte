<!-- 
 Some of this code is remixed from svelte-awesome-slider by Ennoriel under MIT License
 https://github.com/Ennoriel/svelte-awesome-slider
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import { type HTMLInputAttributes } from 'svelte/elements';
	import { on } from 'svelte/events';

	let {
		thumbSize = '2rem',
		name,
		value = $bindable(),
		min = 0,
		max = 100,
		step = 1,
		progressColor = 'var(--buttons-primary-background-color)',
		thumbColor = 'var(--inputs-on-background-color)',
		readonly,
		disabled,
		...restProps
	}: {
		thumbSize?: string;
		name: string;
		value: number;
		min?: number;
		max?: number;
		step?: number;
		progressColor?: string;
		thumbColor?: string;
	} & HTMLInputAttributes = $props();

	let sliderEl = $state<HTMLElement>();
	let isDragging = false;

	function updateValue(e: { clientX: number }) {
		if (!sliderEl || !isDragging || disabled || readonly) return;

		// get the slider's width and the cursor's position
		const clientWidth = sliderEl.clientWidth;
		const sliderOffsetX = sliderEl.getBoundingClientRect().left;
		const offsetX = e.clientX - sliderOffsetX;

		// change value based on the cursor's position
		const percentage = (offsetX / clientWidth) * (max - min) + min;

		// round to the nearest step and clamp the value
		const ratio = 1 / step;
		const rounded = Math.round(percentage * ratio) / ratio;

		value = Math.max(min, Math.min(max, rounded));
	}

	function handleKeydown(e: KeyboardEvent) {
		if (disabled || readonly) return;
		if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
			value = Math.max(value - step, min);
		} else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
			value = Math.min(value + step, max);
		}
	}

	// we declare touch events like so because svelte 5 removes the nonpassive event modifier
	// sucks!!
	onMount(() => {
		on(sliderEl!, 'touchstart', handleTouch, {
			passive: false
		});
		on(sliderEl!, 'touchmove', handleTouch, {
			passive: false
		});
		on(sliderEl!, 'touchend', handleTouch, {
			passive: false
		});
	});

	function handleTouch(e: TouchEvent) {
		if (disabled || readonly) return;

		e.preventDefault();

		if (e.type !== 'touchend') {
			isDragging = true;
			updateValue(e.touches?.[0]);
		} else {
			isDragging = false;
		}
	}
</script>

<svelte:window
	onmousemove={(e) => isDragging && updateValue(e)}
	onmouseup={() => (isDragging = false)}
/>

<div
	class="slider"
	style:--thumb-size={thumbSize}
	style:--min={min}
	style:--max={max}
	style:--step={step}
	style:--value={value}
	style:--progress-color={progressColor}
	style:--thumb-color={thumbColor}
	aria-valuemin={min}
	aria-valuemax={max}
	aria-valuenow={value}
	aria-valuetext={value.toString()}
	aria-disabled={disabled}
	aria-readonly={readonly}
	tabindex="0"
	onmousedown={(e) => {
		isDragging = true;
		updateValue(e);
	}}
	onkeydown={handleKeydown}
	role="slider"
	bind:this={sliderEl}
>
	<div class="progress"></div>
	<div class="thumb"></div>
	<input type="range" {name} {min} {max} {step} aria-hidden="true" bind:value {...restProps} />
</div>

<style lang="scss">
	.slider {
		--thumb-size: var(--thumb-size, 2rem);
		--track-height: calc(var(--thumb-size) + var(--inputs-border-width) * 2);
		--border-radius: calc(var(--inputs-border-base-radius) * 3);
		// a float value from 0 to 1
		--position: calc((var(--value) - var(--min)) / (var(--max) - var(--min)));

		// goes from 0 to 100% of the track width (minus the thumb size)
		--left: calc(var(--position) * (100% - var(--thumb-size)));

		position: relative;
		width: 100%;
		height: var(--track-height);
		border: var(--inputs-border-width) solid var(--inputs-border-color);
		border-radius: var(--border-radius);
		cursor: ew-resize;
		user-select: none;

		.progress {
			position: absolute;
			top: 0;
			left: 0;
			width: calc(var(--left) + var(--thumb-size) / 2);
			height: 100%;
			background-color: var(--progress-color, var(--buttons-primary-background-color));
			border-radius: var(--border-radius) 0 0 var(--border-radius);
		}

		.thumb {
			pointer-events: none;
			position: absolute;
			top: calc(0px - var(--inputs-border-width));
			left: calc(var(--left) - var(--inputs-border-width));
			width: calc(var(--thumb-size) + var(--inputs-border-width) * 2);
			height: calc(var(--thumb-size) + var(--inputs-border-width) * 2);
			border-radius: var(--border-radius);
			border: var(--inputs-border-width) solid var(--inputs-border-color);
			background-color: var(--inputs-background-color);
			&::after {
				content: '';
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: calc(100% - var(--inputs-border-width) * 8);
				height: calc(100% - var(--inputs-border-width) * 8);
				border-radius: calc(var(--border-radius) - var(--inputs-border-width) * 2);
				background-color: var(--thumb-color, var(--inputs-on-background-color));
			}
		}

		&:focus-visible {
			outline: none;

			// give focus outline to the thumb
			.thumb {
				outline: 2px solid var(--outline-color);
				outline-offset: 2px;
			}
		}

		&[aria-disabled='true'] {
			cursor: not-allowed;
			opacity: 0.5;
		}

		&[aria-readonly='true'] {
			cursor: not-allowed;
		}
	}

	input[type='range'] {
		display: none;
	}
</style>
