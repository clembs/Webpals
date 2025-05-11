import { fail, type Actions } from '@sveltejs/kit';
import { getSpotifyPreviewUrl, getSpotifyToken } from '$lib/widgets/music/server-helpers';
import type { Track } from '$lib/widgets/music/helpers';

export const actions: Actions = {
	async default({ request, fetch }) {
		const formData = await request.formData();
		const query = formData.get('query')?.toString();

		if (!query) return fail(400, { message: 'No query provided' });

		try {
			// anonymously fetch the Spotify search page to get a session
			const accessToken = await getSpotifyToken();

			const searchParams = new URLSearchParams();
			searchParams.append('q', query);
			searchParams.append('type', 'track');
			searchParams.append('limit', '10');

			const searchRes = await fetch(`https://api.spotify.com/v1/search?${searchParams}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}).then((r) => r.json());

			const tracks: Track[] = searchRes.tracks.items;

			// this is very ugly and sad but since CORS we can't fetch this on the client
			// and i cba fetching from client to server for every song
			// so it takes longer to load results, sorry and screw spotify tbh
			const tracksWithPreviewUrls = await Promise.all(
				tracks.map(async (t) => ({
					...t,
					preview_url: await getSpotifyPreviewUrl(t.id)
				}))
			);

			return tracksWithPreviewUrls;
		} catch (err) {
			console.log(err);
			return fail(500, { message: `Failed to search. Error: ${err}` });
		}
	}
};
