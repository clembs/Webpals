import type { ConnectionProviderData } from './connection-providers';

export function parseIdentifiableUrl(provider: ConnectionProviderData, rawIdentifiable: string) {
	return provider.hasUrl
		? rawIdentifiable.startsWith('http')
			? rawIdentifiable
			: `https://${provider.identifiablePrefix ?? ''}${rawIdentifiable}`
		: undefined;
}
