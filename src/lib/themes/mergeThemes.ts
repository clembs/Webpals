import { deepMerge } from '@std/collections';
import type { Theme } from './types';

export const plainTheme: Theme = {
	background: {
		type: 'color',
		color: '#f2f2f2'
	},
	avatar: {
		size: 80,
		border: {
			radius: 9999,
			width: 0,
			color: '#ffffff00'
		}
	},
	font: {
		family: 'var(--font-family)',
		color_paragraph: '#656565',
		color_heading: '#000000'
	},
	spacing: {
		gap: 1,
		padding: 1
	},
	widgets: {
		color_background: '#ffffff',
		color_background_dim: '#f2f2f2',
		background_blur: 0,
		border: {
			radius: 1,
			width: 1,
			color: '#999999'
		},
		shadow: {
			color: '#0000000',
			x: 0,
			y: 0,
			blur: 10,
			spread: 0
		}
	},
	primary_buttons: {
		color_background: '#000000',
		color_on_background: '#ffffff',
		border: {
			color: '#000000'
		},
		shadow: null
	},
	secondary_inputs: {
		color_background: '#ffffff',
		color_on_background: '#000000',
		border: {
			radius: 0.5,
			width: 1,
			color: '#999999'
		},
		shadow: null
	}
};

type RecursivePartial<T> = {
	[P in keyof T]?: T[P] extends (infer U)[]
		? RecursivePartial<U>[]
		: T[P] extends object | undefined
			? RecursivePartial<T[P]>
			: T[P];
};

export type PartialTheme = RecursivePartial<Theme>;

export function mergeThemes(baseTheme: Theme, partialTheme: PartialTheme): Theme {
	return deepMerge(baseTheme, partialTheme) as Theme;
}
