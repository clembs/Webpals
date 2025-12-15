import type { InferInput } from 'valibot';
import type { ThemeStructure } from './theme-structure';

type RecursivePartial<T> = {
	[P in keyof T]?: T[P] extends (infer U)[]
		? RecursivePartial<U>[]
		: T[P] extends object | undefined
			? RecursivePartial<T[P]>
			: T[P];
};

export type Theme = InferInput<typeof ThemeStructure>;

export type PartialTheme = RecursivePartial<Theme>;
