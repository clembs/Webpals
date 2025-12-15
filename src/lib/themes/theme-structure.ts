import {
	number,
	strictObject,
	hexColor,
	pipe,
	string,
	union,
	array,
	literal,
	nullable,
	picklist,
	regex,
	omit,
	minValue,
	maxValue,
	partial,
	optional,
	transform
} from 'valibot';

const HexColorStructure = pipe(string(), hexColor());

const BorderStructure = strictObject({
	// radius used to be a percentage or a number
	// now we normalize strings to a number
	radius: union([
		pipe(
			string(),
			regex(/^(\d+)%$/),
			transform((percentage) => 9999 * (parseInt(percentage.replace('%', '')) / 100)),
			number()
		),
		pipe(number(), minValue(0), maxValue(3))
	]),
	width: pipe(number(), minValue(0), maxValue(10)),
	color: HexColorStructure
});

const ShadowStructure = strictObject({
	color: HexColorStructure,
	x: number(),
	y: number(),
	blur: number(),
	spread: number()
});

const ImageBackgroundStructure = strictObject({
	image_url: string(),
	image_position: picklist(['center', 'top', 'bottom', 'left', 'right']),
	image_size: picklist(['auto', 'cover', 'contain']),
	image_repeat: picklist(['no-repeat', 'repeat']),
	image_rendering: picklist(['smooth', 'pixelated']),
	image_attachment: picklist(['scroll', 'fixed'])
});

const ColorBackgroundStructure = strictObject({
	color: HexColorStructure
});

const GradientBackgroundStructure = strictObject({
	gradient_colors: array(HexColorStructure),
	gradient_direction: nullable(number()),
	gradient_type: picklist(['linear', 'radial', 'conic'])
});

const BackgroundStructure = union([
	strictObject({
		type: literal('gradient'),
		...GradientBackgroundStructure.entries,
		...partial(ColorBackgroundStructure).entries,
		...partial(ImageBackgroundStructure).entries
	}),
	strictObject({
		type: literal('color'),
		...ColorBackgroundStructure.entries,
		...partial(GradientBackgroundStructure).entries,
		...partial(ImageBackgroundStructure).entries
	}),
	strictObject({
		type: literal('image'),
		...ImageBackgroundStructure.entries,
		...partial(ColorBackgroundStructure).entries,
		...partial(GradientBackgroundStructure).entries
	})
]);

export const fontStyles = [
	{
		label: 'Default',
		value: 'Public Sans',
		stylesheetHref: ''
	},
	{
		label: 'Fancy',
		value: 'EB Garamond',
		stylesheetHref: '/fonts/styles/EBGaramond.css'
	},
	{
		label: 'Cute',
		value: 'Playpen Sans',
		stylesheetHref: '/fonts/styles/PlaypenSans.css'
	},
	{
		label: 'Handwritten',
		value: 'Merienda',
		stylesheetHref: '/fonts/styles/Merienda.css'
	},
	{
		label: 'Pixel',
		value: 'Pixelify Sans',
		stylesheetHref: '/fonts/styles/PixelifySans.css'
	},
	{
		label: 'Gothic',
		value: 'Grenze Gotisch',
		stylesheetHref: '/fonts/styles/GrenzeGotisch.css'
	},
	{
		label: 'Code',
		value: 'JetBrains Mono',
		stylesheetHref: '/fonts/styles/JetBrainsMono.css'
	},
	{
		label: 'Gummy',
		value: 'Sour Gummy',
		stylesheetHref: '/fonts/styles/SourGummy.css'
	}
] as const;

const FontStylesStructure = picklist(fontStyles.map((style) => style.value));

export const ThemeStructure = strictObject({
	background: BackgroundStructure,
	avatar: strictObject({
		size: number(),
		border: nullable(BorderStructure)
	}),
	font: strictObject({
		family: optional(literal('var(--font-family)')), // legacy, shouldn't be used anymore
		style_paragraph: FontStylesStructure,
		style_heading: FontStylesStructure,
		color_paragraph: HexColorStructure,
		color_heading: HexColorStructure
	}),
	spacing: strictObject({
		padding: pipe(number(), minValue(0.25), maxValue(2)),
		gap: pipe(number(), minValue(0.25), maxValue(2))
	}),
	widgets: strictObject({
		color_background: HexColorStructure,
		color_background_dim: HexColorStructure,
		border: BorderStructure,
		shadow: nullable(ShadowStructure),
		background_blur: pipe(number(), minValue(0), maxValue(10))
	}),
	primary_buttons: pipe(
		strictObject({
			color_background: HexColorStructure,
			color_on_background: HexColorStructure,
			border: omit(BorderStructure, ['radius', 'width']),
			shadow: optional(nullable(ShadowStructure))
		}),
		// strip shadows since they're unused now
		transform((input) => ({
			color_background: input.color_background,
			color_on_background: input.color_on_background,
			border: input.border
		}))
	),
	secondary_inputs: pipe(
		strictObject({
			color_background: HexColorStructure,
			color_on_background: HexColorStructure,
			border: BorderStructure,
			shadow: optional(nullable(ShadowStructure))
		}),
		// strip shadows since they're unused now
		transform((input) => ({
			color_background: input.color_background,
			color_on_background: input.color_on_background,
			border: input.border
		}))
	)
});
