import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';

export async function getSpotifyToken() {
	const response: {
		access_token: string;
		token_type: 'Bearer';
		expires_in: number;
	} = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'client_credentials'
		})
	}).then((r) => r.json());

	return response.access_token;
}

// Very very very helpful workaround
// since the Spotify API does not provide 30s preview URLs in the API results
// Discovered by Diego Perez on StackOverflow
// https://stackoverflow.com/a/79238027
// and ported in TypeScript by rexdotsh
// https://github.com/rexdotsh/spotify-preview-url-workaround under MIT license
export async function getSpotifyPreviewUrl(trackId: string): Promise<string | null> {
	try {
		const embedUrl = `https://open.spotify.com/embed/track/${trackId}`;
		const response = await fetch(embedUrl);
		const html = await response.text();

		const matches = html.match(/"audioPreview":\s*{\s*"url":\s*"([^"]+)"/);
		return matches ? matches[1] : null;
	} catch (error) {
		console.error('Failed to fetch Spotify preview URL:', error);
		return null;
	}
}
