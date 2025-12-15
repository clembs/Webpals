import Spinner from '$icons/Spinner.svelte';
import { CheckCircle, WarningCircle, type IconComponentProps } from 'phosphor-svelte';
import type { Component, Snippet } from 'svelte';

type ToastSnippetContent = {
	snippet: Snippet<[unknown]>;
	snippetProps?: Record<string, unknown>;
};

type ToastTextContent =
	| string
	| {
			icon?: Component<IconComponentProps>;
			title: string;
			subtitle?: string;
	  };

type ToastContent = ToastSnippetContent | ToastTextContent;

type ToastOptions = {
	variant?: 'primary' | 'success' | 'urgent';
	autoDismiss?: boolean;
};

const defaultToastOptions: ToastOptions = {
	autoDismiss: true,
	variant: 'primary'
};

export class Toast {
	id: number;
	icon? = $state<Component<IconComponentProps>>();
	title? = $state<string>();
	subtitle? = $state<string>();
	snippet? = $state<Snippet<[unknown]>>();
	snippetProps? = $state<Record<string, unknown>>();
	options = $state(defaultToastOptions);
	#dismissTimeout?: number | NodeJS.Timer;

	#parseContentAndUpdate(content: ToastContent) {
		if (typeof content === 'string') {
			this.title = content;
			this.subtitle = undefined;
		} else if ('snippet' in content) {
			this.snippet = content.snippet;
			this.snippetProps = content.snippetProps;
		} else {
			this.icon = content.icon;
			this.title = content.title;
			this.subtitle = content.subtitle;
		}
	}

	constructor(id: number, content: ToastContent, options?: ToastOptions) {
		this.id = id;
		this.#parseContentAndUpdate(content);
		this.options = { ...this.options, ...options };

		this.startAutoDismiss();
	}

	/**
	 * Update the toast's contents
	 * @param content The new contents of the toast
	 */
	update(content: ToastContent) {
		this.#parseContentAndUpdate(content);
	}

	/**
	 * Update the toast with a success state & dismiss it
	 * @param content The new contents of the toast
	 */
	success(content: ToastTextContent) {
		this.#parseContentAndUpdate(content);
		this.icon = CheckCircle;
		this.options.variant = 'success';
		this.options.autoDismiss = true;

		this.startAutoDismiss(2000);
	}

	/**
	 * Update the toast with an error state & dismiss it
	 * @param content The new contents of the toast
	 */
	error(content: ToastTextContent) {
		this.#parseContentAndUpdate(content);
		this.icon = WarningCircle;
		this.options.variant = 'urgent';
		this.options.autoDismiss = true;

		this.startAutoDismiss(2000);
	}

	/**
	 * Programmatically dismiss the toast
	 */
	dismiss() {
		toaster.dismiss(this.id);
	}

	/**
	 * Start/resume the autodismiss behavior of the toast. Respects the `options.autoDismiss` option.
	 * @param timeout In how much time the toast should be dismissed (in milliseconds)
	 */
	startAutoDismiss(timeout = 3000) {
		if (!this.options.autoDismiss) return;

		this.#dismissTimeout = setTimeout(() => {
			this.dismiss();
		}, timeout);
	}

	/**
	 * Stop/pause the toast from being automatically dismissed
	 */
	stopAutoDismiss() {
		clearTimeout(this.#dismissTimeout);
		this.#dismissTimeout = undefined;
	}
}

class ToastPortal {
	toasts = $state<Toast[]>([]);

	/**
	 * Spawns a toast
	 * @param content The toast's message or content
	 * @param options Behavioral and appearance options
	 */
	toast(content: ToastContent, options?: ToastOptions) {
		const previousToast = this.toasts.at(-1);
		const newToastId = previousToast ? previousToast.id + 1 : 0;

		const newToast = new Toast(newToastId, content, options);
		this.toasts = [...this.toasts, newToast];

		return newToast;
	}

	/**
	 * Spawns a success toast
	 * @param content The toast's message or content
	 * @param options Behavioral options
	 */
	success(content: ToastTextContent, options?: ToastOptions) {
		options = { ...options, variant: 'success' };

		return this.toast(
			{
				...(typeof content === 'object'
					? content
					: {
							title: content
						}),
				icon: CheckCircle
			},
			options
		);
	}

	/**
	 * Spawns an error toast
	 * @param content The toast's message or content
	 * @param options Behavioral options
	 */
	error(content: ToastTextContent, options?: ToastOptions) {
		options = { ...options, variant: 'urgent' };

		return this.toast(
			{
				...(typeof content === 'object'
					? content
					: {
							title: content
						}),
				icon: WarningCircle
			},
			options
		);
	}

	/**
	 * Spawns a toast with a spinner that does not auto-dismiss
	 * @param content The toast's message or content
	 * @param options Behavioral and appearance options
	 */
	load(content: ToastTextContent, options?: ToastOptions) {
		options = { ...options, autoDismiss: false };

		return this.toast(
			{
				...(typeof content === 'object'
					? content
					: {
							title: content
						}),
				icon: Spinner
			},
			options
		);
	}

	/**
	 * Programmatically dismiss a toast using its ID
	 * @param toastId The ID of the toast you wish to dismiss
	 */
	dismiss(toastId: number) {
		this.toasts.splice(
			this.toasts.findIndex(({ id }) => id === toastId),
			1
		);
	}
}

export const toaster = new ToastPortal();
