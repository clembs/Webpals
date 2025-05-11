import SpotifyLogo from '$icons/brands/SpotifyLogo.svelte';
import { FileAudio } from 'phosphor-svelte';

export type Track = {
	id: string;
	name: string;
	artists: { name: string; id: string }[];
	album: { name: string; images: { url: string }[]; href: string };
	external_urls: { spotify: string };
	preview_url: string | null;
};

export const musicProviders = [
	{
		label: 'Spotify',
		description: 'Browse millions of songs (30 second snippets only)',
		value: 'spotify',
		icon: SpotifyLogo
	},
	{
		label: 'Local file',
		description: 'Upload a supported audio file',
		value: 'local',
		icon: FileAudio
	}
] as const;

export type MusicProvider = (typeof musicProviders)[number]['value'];
