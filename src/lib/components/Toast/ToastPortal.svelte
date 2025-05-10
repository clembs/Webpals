<script lang="ts">
	import { fly, type TransitionConfig } from 'svelte/transition';
	import { toaster } from './toast.svelte';
	import { quadInOut } from 'svelte/easing';

	let toastsListEl = $state<HTMLOListElement>();

	function exitAndSlideItemsUp(node: HTMLElement): TransitionConfig {
		const nodeHeight = node.clientHeight;

		toastsListEl?.childNodes.forEach((child) => {
			if (child.isEqualNode(node)) return;
			const animateKeyframes = [
				{ transform: `translateY(${0}px)` },
				{ transform: `translateY(${0 - nodeHeight}px)` }
			];

			(child as HTMLElement)?.animate?.(animateKeyframes, {
				duration: 200,
				easing: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)'
			});
		});
		return {
			duration: 200,
			easing: quadInOut,
			css(t) {
				return `
  				transform: scale(${0.75 + 0.25 * t});
          opacity: ${t}
        `;
			}
		};
	}

	function pauseAllToasts() {
		toaster.toasts.forEach((t) => t.options.autoDismiss && t.stopAutoDismiss());
	}

	function resumeAllToasts() {
		toaster.toasts.forEach((t) => t.options.autoDismiss && t.startAutoDismiss(2000));
	}
</script>

<toast-portal role="alert" aria-live="polite" aria-relevant="additions text">
	<ol bind:this={toastsListEl} onmouseenter={pauseAllToasts} onmouseleave={resumeAllToasts}>
		{#each toaster.toasts as toast (toast.id)}
			<li
				class="toast"
				data-variant={toast.options.variant}
				data-toast-id={toast.id}
				in:fly={{ x: 400, duration: 150 }}
				out:exitAndSlideItemsUp
			>
				{#if toast.title}
					{#if toast.icon}
						<toast.icon />
					{/if}

					{toast.title}
				{:else if toast.snippet}
					{@render toast.snippet(toast.snippetProps)}
				{/if}
			</li>
		{/each}
	</ol>
</toast-portal>

<style lang="scss">
	toast-portal {
		position: fixed;
		z-index: 1001; // so they can go above dialogs
		top: var(--base-padding);
		right: var(--base-padding);

		ol {
			display: flex;
			flex-direction: column;
			list-style: none;
			gap: calc(var(--base-gap) * 0.5);
		}

		.toast {
			display: flex;

			min-width: 300px;
			max-width: 100%;
			padding: var(--base-padding);
			gap: var(--base-gap);
			border-radius: var(--widgets-border-base-radius);

			background-color: var(--background-color);
			color: var(--on-background-color);
			box-shadow: var(--widgets-box-shadow-x) var(--widgets-box-shadow-y)
				var(--widgets-box-shadow-blur) var(--widgets-box-shadow-spread)
				var(--widgets-box-shadow-color);

			&[data-variant='primary'] {
				--background-color: var(--buttons-primary-background-color);
				--on-background-color: var(--buttons-primary-on-background-color);
			}

			&[data-variant='success'] {
				--background-color: var(--color-success);
				--on-background-color: var(--buttons-primary-on-background-color);
			}

			&[data-variant='urgent'] {
				--background-color: var(--color-urgent);
				--on-background-color: var(--buttons-primary-on-background-color);
			}
		}
	}
</style>
