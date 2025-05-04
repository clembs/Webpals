import type { BaseWidgetJSON } from '../types';

export type CustomWidgetJSON = BaseWidgetJSON & {
	blocks: AnyBlock[];
};

export type Block = {
	json_endpoint?: string;
};

export type TextBlock = Block & {
	type: 'text';
	content: string;
	editable?: boolean;
	text_type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'paragraph' | 'subtext';
};

export type LayoutBlock = Block & {
	type: 'layout';
	blocks: AnyBlock[];
};

export type KeyValueBlock = Block & {
	type: 'key_value';
	key: string;
	value: string;
};

export type AnyBlock = TextBlock | LayoutBlock | KeyValueBlock;
