import { deepMerge } from '@std/collections';
import type { PartialTheme, Theme } from './types';
import { plainTheme } from './plain-theme';

export function mergeThemes(partialTheme: PartialTheme, baseTheme: Theme = plainTheme): Theme {
	return deepMerge(baseTheme, partialTheme) as Theme;
}
