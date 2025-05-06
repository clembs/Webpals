import Spinner from '$icons/Spinner.svelte';
import { CheckCircle, type IconComponentProps } from 'phosphor-svelte';
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
	autodismiss?: boolean;
};

const defaultToastOptions: ToastOptions = {
	autodismiss: true,
	variant: 'primary'
};

class Toast {
	id: number;
	icon = $state<Component<IconComponentProps>>();
	title? = $state<string>();
	subtitle? = $state<string>();
	snippet?: Snippet<[unknown]>;
	snippetProps?: Record<string, unknown>;
	options = $state(defaultToastOptions);

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
	}

	success(content: ToastTextContent | string) {
		this.#parseContentAndUpdate(content);
		this.icon = CheckCircle;
		this.options.variant = 'success';

		setTimeout(() => {
			this.dismiss();
		}, 2000);
	}

	update(content: ToastContent | string) {
		this.#parseContentAndUpdate(content);
	}

	dismiss() {
		toaster.dismiss(this.id);
	}
}

class ToastPortal {
	toasts = $state<Toast[]>([]);

	toast(content: string | ToastContent, options?: ToastOptions) {
		const previousToast = this.toasts.at(-1);
		const newToastId = previousToast ? previousToast.id + 1 : 0;

		const newToast = new Toast(newToastId, content, options);
		this.toasts = [...this.toasts, newToast];

		if (newToast.options.autodismiss) {
			setTimeout(() => {
				newToast.dismiss();
			}, 3000);
		}

		return newToast;
	}

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

	load(content: ToastTextContent, options?: ToastOptions) {
		options = { ...options, autodismiss: false };

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

	dismiss(toastId: number) {
		this.toasts.splice(
			this.toasts.findIndex(({ id }) => id === toastId),
			1
		);
	}
}

export const toaster = new ToastPortal();
