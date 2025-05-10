// note: some of the more complex regex has been AI-generated and im kind of ashamed of myself but regex is kinda hard and i mean ive tested a few edge cases for each and they work fine.
// if you're a regex wizard reading this and something doesn't work, help me by submitting an issue.

import { Envelope, Globe, Phone, type IconComponentProps } from 'phosphor-svelte';
import DiscordLogo from '$icons/brands/DiscordLogo.svelte';
import { EMAIL_REGEX } from 'valibot';
import PretendoLogo from '$icons/brands/PretendoLogo.svelte';
import BlueskyLogo from '$icons/brands/BlueskyLogo.svelte';
import XLogo from '$icons/brands/XLogo.svelte';
import SteamLogo from '$icons/brands/SteamLogo.svelte';
import YouTubeLogo from '$icons/brands/YouTubeLogo.svelte';
import GitHubLogo from '$icons/brands/GitHubLogo.svelte';
import FacebookLogo from '$icons/brands/FacebookLogo.svelte';
import RedditLogo from '$icons/brands/RedditLogo.svelte';
import SignalLogo from '$icons/brands/SignalLogo.svelte';
import SpotifyLogo from '$icons/brands/SpotifyLogo.svelte';
import TwitchLogo from '$icons/brands/TwitchLogo.svelte';
import InstagramLogo from '$icons/brands/InstagramLogo.svelte';
import LinkedInLogo from '$icons/brands/LinkedInLogo.svelte';
import KoFiLogo from '$icons/brands/KoFiLogo.svelte';
import LastFmLogo from '$icons/brands/LastFmLogo.svelte';
import MastodonLogo from '$icons/brands/MastodonLogo.svelte';
import PatreonLogo from '$icons/brands/PatreonLogo.svelte';
import StartGgLogo from '$icons/brands/StartGgLogo.svelte';
import ThreadsLogo from '$icons/brands/ThreadsLogo.svelte';
import { USERNAME_REGEX } from '$lib/helpers/constants';
import Webpals from '$icons/Webpals.svelte';
import type { Component } from 'svelte';

export const connectionProviderKeys = [
	'bluesky',
	'discord',
	'domain',
	'email',
	'facebook',
	'github',
	'instagram',
	'kofi',
	'lastfm',
	'linkedin',
	'mastodon',
	'patreon',
	// 'pixelfed',
	'phone',
	'pretendo',
	'reddit',
	'signal',
	'spotify',
	'startgg',
	'steam',
	'threads',
	'twitch',
	'twitter',
	'webpals',
	'youtube'
] as const;

export type ConnectionProvider = (typeof connectionProviderKeys)[number];

export const connectionProviders: Record<
	ConnectionProvider,
	{
		name: string;
		icon: Component<IconComponentProps>;
		iconProps?: IconComponentProps;
		// the regex pattern to match the identifiable part of the connection
		identifiablePattern?: RegExp;
		// the label shown above the identifiable input
		identifiableInputLabel?: string;
		// an example or explanation of what to input
		identifiableInputPlaceholder?: string;
		// what comes before the identifiable, used to build URLs
		identifiablePrefix?: string;
		// true the connection links to a webpage, false if it's just text
		hasUrl: boolean;
		// whether the connection can be oauth verified
		verifiable: boolean;
	}
> = {
	bluesky: {
		name: 'Bluesky',
		icon: BlueskyLogo,
		// works for domain names, DID PLC identities and Web DID identities.
		identifiablePattern:
			// wrote this regex myself. proud of it.
			/^((?:[a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]+|^(?:did:plc:[a-zA-Z0-9]{24})$|^(?:did:web:[a-zA-Z0-9.]+))$/,
		identifiableInputLabel: 'Bluesky handle or DID',
		identifiableInputPlaceholder: 'e.g. clembs.com, yourname.bsky.social, did:plc:...',
		identifiablePrefix: 'bsky.app/profile/',
		hasUrl: true,
		verifiable: true
	},
	discord: {
		name: 'Discord',
		icon: DiscordLogo,
		identifiablePattern: /^([a-zA-Z0-9._]{2,32})$/,
		identifiableInputLabel: 'Discord username',
		identifiableInputPlaceholder: 'what comes after the @ (e.g. clembs)',
		hasUrl: false,
		verifiable: true
	},
	email: {
		name: 'Email address',
		icon: Envelope,
		iconProps: { weight: 'regular' },
		identifiablePattern: EMAIL_REGEX,
		identifiableInputLabel: 'Email address',
		identifiableInputPlaceholder: 'e.g. clembs@clembs.com',
		hasUrl: false,
		verifiable: true
	},
	facebook: {
		name: 'Facebook',
		icon: FacebookLogo,
		identifiablePattern: /^([a-zA-Z0-9.]{5,50})$/,
		identifiableInputLabel: 'Facebook username',
		identifiablePrefix: 'facebook.com/',
		hasUrl: true,
		verifiable: true
	},
	github: {
		name: 'GitHub',
		icon: GitHubLogo,
		identifiablePattern: /^([a-zA-Z0-9-]{1,39})$/,
		identifiableInputLabel: 'GitHub username',
		identifiableInputPlaceholder: 'e.g. clembs',
		identifiablePrefix: 'github.com/',
		hasUrl: true,
		verifiable: true
	},
	instagram: {
		name: 'Instagram',
		icon: InstagramLogo,
		identifiablePattern: /^([a-zA-Z0-9._]{1,30})$/,
		identifiableInputLabel: 'Instagram handle',
		identifiableInputPlaceholder: 'e.g. clembs.v',
		identifiablePrefix: 'instagram.com/',
		hasUrl: true,
		verifiable: true
	},
	kofi: {
		name: 'Ko-fi',
		icon: KoFiLogo,
		identifiablePattern: /^([a-zA-Z0-9-]{1,50})$/,
		identifiableInputLabel: 'Ko-fi username',
		identifiableInputPlaceholder: 'e.g. clembs',
		identifiablePrefix: 'ko-fi.com/',
		hasUrl: true,
		verifiable: false
	},
	lastfm: {
		name: 'Last.fm',
		icon: LastFmLogo,
		identifiablePattern: /^([a-zA-Z0-9-]{1,50})$/,
		identifiableInputLabel: 'Last.fm username',
		identifiablePrefix: 'last.fm/user/',
		hasUrl: true,
		verifiable: false
	},
	linkedin: {
		name: 'LinkedIn',
		icon: LinkedInLogo,
		identifiablePattern: /^([a-zA-Z0-9-]{1,50})$/,
		identifiableInputLabel: 'LinkedIn username',
		identifiablePrefix: 'linkedin.com/in/',
		hasUrl: true,
		verifiable: true
	},
	mastodon: {
		name: 'Mastodon',
		icon: MastodonLogo,
		// taken from https://regex101.com/r/ac4fG5/2, thank you very much
		identifiablePattern: /^@?\b(?:[a-zA-Z0-9._%+-]+)@(?:[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b$/,
		identifiablePrefix: 'mastodon.social/@',
		identifiableInputLabel: 'Mastodon full handle',
		identifiableInputPlaceholder: 'e.g. @clembs@mastodon.social',
		hasUrl: true,
		verifiable: false
	},
	patreon: {
		name: 'Patreon',
		icon: PatreonLogo,
		identifiablePattern: /^([a-zA-Z0-9-]{1,50})$/,
		identifiablePrefix: 'patreon.com/',
		identifiableInputLabel: 'Patreon username',
		hasUrl: true,
		verifiable: false
	},
	phone: {
		name: 'Phone number',
		icon: Phone,
		identifiablePattern: /^(\+?[0-9]{1,3}-?[0-9\- ]{3,14})$/,
		identifiableInputLabel: 'Phone number',
		identifiableInputPlaceholder: 'e.g. +33-123-456-789',
		hasUrl: false,
		verifiable: false
	},
	pretendo: {
		name: 'Pretendo Network ID',
		icon: PretendoLogo,
		identifiableInputLabel: 'Pretendo Network ID',
		hasUrl: false,
		verifiable: false
	},
	reddit: {
		name: 'Reddit',
		icon: RedditLogo,
		identifiablePattern: /^([a-zA-Z0-9_]{3,20})$/,
		identifiableInputLabel: 'Reddit username',
		identifiableInputPlaceholder: 'e.g. spez if your username is u/spez',
		identifiablePrefix: 'reddit.com/u/',
		hasUrl: true,
		verifiable: true
	},
	signal: {
		name: 'Signal',
		icon: SignalLogo,
		identifiablePattern: /^([a-zA-Z0-9_]{3,32}\.\d{2})$/,
		identifiableInputLabel: 'Signal username',
		identifiableInputPlaceholder: 'e.g. name.00',
		hasUrl: false,
		verifiable: false
	},
	spotify: {
		name: 'Spotify',
		icon: SpotifyLogo,
		identifiablePattern: /^([0-9A-Za-z-]{2,32})$/,
		identifiablePrefix: 'open.spotify.com/user/',
		identifiableInputLabel: 'Spotify username or user ID',
		identifiableInputPlaceholder: 'found in your profile URL, e.g. 8n100zlbhhtzjxpbd9mey2opt',
		hasUrl: true,
		verifiable: true
	},
	startgg: {
		name: 'Start.gg',
		icon: StartGgLogo,
		identifiablePattern: /^([a-zA-Z0-9]{8})$/,
		identifiablePrefix: 'start.gg/user/',
		identifiableInputLabel: 'Start.gg user ID',
		hasUrl: true,
		verifiable: true
	},
	steam: {
		name: 'Steam',
		icon: SteamLogo,
		// works for steamcommunity.com URLs. group 1 is the SteamID or profile URL
		identifiablePattern: /^((?:id|profiles)\/[a-zA-Z0-9_-]+)(?:\?.*)?$/,
		identifiablePrefix: 'steamcommunity.com/',
		identifiableInputLabel: 'Steam profile ID or URL',
		hasUrl: true,
		verifiable: true
	},
	threads: {
		name: 'Threads',
		icon: ThreadsLogo,
		identifiablePattern: /^([a-zA-Z0-9._]{1,30})$/,
		identifiablePrefix: 'threads.net/@',
		identifiableInputLabel: 'Threads handle',
		identifiableInputPlaceholder: 'the instagram handle you used to sign up',
		hasUrl: true,
		verifiable: false
	},
	twitch: {
		name: 'Twitch',
		icon: TwitchLogo,
		identifiablePattern: /^([a-zA-Z0-9_]{4,25})$/,
		identifiableInputLabel: 'Twitch username',
		identifiablePrefix: 'twitch.tv/',
		identifiableInputPlaceholder: 'e.g. clembs',
		hasUrl: true,
		verifiable: true
	},
	twitter: {
		name: 'X/Twitter',
		icon: XLogo,
		identifiablePattern: /^([a-zA-Z0-9_]{1,15})$/,
		identifiableInputLabel: 'X/Twitter handle',
		identifiablePrefix: 'x.com/',
		identifiableInputPlaceholder: 'what comes after the @ (e.g. clembsv)',
		hasUrl: true,
		verifiable: true
	},
	webpals: {
		name: 'Webpals',
		icon: Webpals,
		identifiablePattern: USERNAME_REGEX,
		identifiablePrefix: 'webpals.me/',
		identifiableInputLabel: 'Webpals username',
		identifiableInputPlaceholder: 'what comes after the @ (e.g. clembs)',
		hasUrl: true,
		verifiable: true
	},
	youtube: {
		name: 'YouTube',
		icon: YouTubeLogo,
		// works for youtube.com URLs. group 1 is the channelId. group 2 is the handle or username
		// modified from https://stackoverflow.com/a/65726047 (ty)
		identifiablePattern: /^(?:channel\/(UC[\w-]{21}[AQgw])|(?:c\/|user\/)?([\w@-]+))$/,
		identifiableInputLabel: 'YouTube username/handle/channel ID',
		identifiablePrefix: 'youtube.com/',
		identifiableInputPlaceholder: 'what comes after the @ (e.g. clembs)',
		hasUrl: true,
		verifiable: true
	},
	domain: {
		name: 'Website',
		icon: Globe,
		// honestly tho idk why i called this "domain" when it can be any website
		// modified from https://uibakery.io/regex-library/url to group the domain
		identifiablePattern:
			/^(?:https?:\/\/)?((?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6})\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,
		identifiableInputLabel: 'Website URL or domain',
		identifiableInputPlaceholder: 'e.g. crbt.app, https://clembs.com/contact',
		hasUrl: true,
		verifiable: true
	}
};

export const connectionProvidersArray = Object.entries(connectionProviders).map(([id, rest]) => ({
	id: id as ConnectionProvider,
	...rest
}));
