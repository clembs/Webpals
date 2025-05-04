import type { Profile } from '$lib/db/types';
import type { MusicProvider } from '$lib/widgets/music/music';
import type { CustomWidgetJSON } from './custom-widgets/types';

export type BaseWidgetJSON = {
	id: string;
};

export type MusicJSON = BaseWidgetJSON & {
	id: 'music';
	content_url: string | null;
	provider: MusicProvider | null;
	title: string | null;
	artist: string | null;
	album_art_url: string | null;
	external_url: string | null;
};

export type AboutMeJSON = BaseWidgetJSON & {
	id: 'about_me';
	content: string;
};

export type FriendsJSON = BaseWidgetJSON & {
	id: 'friends';
};

export type PostsJSON = BaseWidgetJSON & {
	id: 'posts';
};

export type ConnectionsJSON = BaseWidgetJSON & {
	id: 'connections';
};

export type ClockJSON = BaseWidgetJSON & {
	id: 'clock';
	timezone: string;
	show_seconds: boolean;
	hour_format: '12h' | '24h';
	city: string;
	country: string;
};

export type AnyDefaultWidgetJSON =
	| MusicJSON
	| AboutMeJSON
	| FriendsJSON
	| PostsJSON
	// | CommentsJSON
	| ConnectionsJSON
	| ClockJSON;

export type AnyWidgetJSON = AnyDefaultWidgetJSON | CustomWidgetJSON;

export type WidgetComponentProps<T extends AnyWidgetJSON> = {
	profile: Profile;
	widget: T;
	editing: boolean;
};
