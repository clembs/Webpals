import type { InferInput } from 'valibot';
import type { ThemeStructure } from './theme-structure';

export type Theme = InferInput<typeof ThemeStructure>;
