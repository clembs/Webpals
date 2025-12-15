import type { Theme } from './types';

export const plainTheme: Theme = {
	background: {
		type: 'color',
		color: '#e5e5e5'
	},
	avatar: {
		size: 80,
		border: {
			radius: 999,
			width: 0,
			color: '#ffffff00'
		}
	},
	font: {
		color_paragraph: '#7f7f7f',
		color_heading: '#000000',
		style_heading: 'Public Sans',
		style_paragraph: 'Public Sans'
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
			radius: 1.5,
			width: 1,
			color: '#999999'
		},
		shadow: {
			color: '#19191907',
			x: 0,
			y: 16,
			blur: 32,
			spread: -4
		}
	},
	primary_buttons: {
		color_background: '#000000',
		color_on_background: '#ffffff',
		border: {
			color: '#000000'
		}
	},
	secondary_inputs: {
		color_background: '#f2f2f2',
		color_on_background: '#000000',
		border: {
			width: 1,
			color: '#999',
			radius: 0.75
		}
	}
};
