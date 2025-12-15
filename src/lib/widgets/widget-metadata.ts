import type {
	AboutMeJSON,
	ClockJSON,
	ConnectionsJSON,
	FriendsJSON,
	MusicJSON,
	WidgetComponentProps,
	AnyWidgetJSON
} from './types';
import type { CurrentProfile } from '$lib/db/types';
import type { MaybePromise } from 'valibot';
import type { Component } from 'svelte';
import MusicWidget from './music/MusicWidget.svelte';
import AboutMeWidget from './about-me/AboutMeWidget.svelte';
import FriendsWidget from './friends/FriendsWidget.svelte';
import ConnectionsWidget from './connections/ConnectionsWidget.svelte';
import ClockWidget from './clock/ClockWidget.svelte';

export type WidgetMetadata<T extends AnyWidgetJSON> = {
	id: string;
	label: string;
	description: string;
	amountAllowedAtOnce?: 1 | 'multiple';
	component: Component<WidgetComponentProps<T>>;
	generateDefault: (props?: {
		clientAddress?: string;
		profile?: CurrentProfile;
	}) => MaybePromise<T>;
};

export const musicWidgetData: WidgetMetadata<MusicJSON> = {
	id: 'music',
	label: 'Music',
	description: 'TODO',
	amountAllowedAtOnce: 1,
	component: MusicWidget,
	generateDefault: () => ({
		id: 'music',
		content_url: null,
		provider: null,
		title: null,
		artist: null,
		album_art_url: null,
		external_url: null
	})
};

export const aboutMeWidgetData: WidgetMetadata<AboutMeJSON> = {
	id: 'about_me',
	label: 'About me',
	description: 'TODO',
	component: AboutMeWidget,
	generateDefault: () => ({
		id: 'about_me',
		content: 'Hello, Webpals!'
	})
};

export const friendsWidgetData: WidgetMetadata<FriendsJSON> = {
	id: 'friends',
	label: 'Friends',
	description: '',
	amountAllowedAtOnce: 1,
	component: FriendsWidget,
	generateDefault: () => ({
		id: 'friends'
	})
};

export const connectionsWidgetData: WidgetMetadata<ConnectionsJSON> = {
	id: 'connections',
	label: 'Connections',
	description: '',
	component: ConnectionsWidget,
	generateDefault: () => ({
		id: 'connections'
	})
};

export const clockWidgetData: WidgetMetadata<ClockJSON> = {
	id: 'clock',
	label: 'Clock',
	description: '',
	amountAllowedAtOnce: 1,
	component: ClockWidget,
	generateDefault: () => {
		return {
			id: 'clock',
			city: 'Paris',
			country: 'France',
			hour_format: '24h',
			show_seconds: false,
			timezone: 'Europe/Paris'
		};
	}
};

export const defaultWidgets = [
	musicWidgetData,
	aboutMeWidgetData,
	friendsWidgetData,
	connectionsWidgetData,
	clockWidgetData
] as WidgetMetadata<AnyWidgetJSON>[];
