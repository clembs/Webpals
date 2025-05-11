import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { connectionProviders } from '$lib/widgets/connections/connection-providers';
import { db } from '$lib/db';
import { connections } from '$lib/db/schema/profiles';
import { eq } from 'drizzle-orm';
import { parseIdentifiableUrl } from '$lib/widgets/connections/helpers';

export async function editConnection({
	locals: { getCurrentProfile },
	request,
	url
}: RequestEvent) {
	const user = getCurrentProfile();

	if (!user) redirect(302, '/login');

	const connectionsWidget = user.widgets
		.find((column) => column.find((w) => w.id === 'connections'))
		?.find((w) => w.id === 'connections');

	if (!connectionsWidget) {
		return fail(400, {
			message: 'No connection widget'
		});
	}

	const connectionId = url.searchParams.get('connection-id');
	const connection = user.connections.find(({ id }) => id === connectionId);

	if (!connection) {
		return fail(400, {
			message: 'Invalid connection ID'
		});
	}

	const formData = await request.formData();
	const rawIdentifiable = formData.get('connection-identifiable')?.toString();
	const label = formData.get('connection-label')?.toString();

	if (!rawIdentifiable || !connectionId) {
		return fail(400, {
			message: 'Missing required fields'
		});
	}

	if (rawIdentifiable.length > 64) {
		return fail(400, {
			message: 'Identifiable is too long'
		});
	}

	if (label && label.length > 32) {
		return fail(400, {
			message: 'Label is too long'
		});
	}

	const connectionProvider = connectionProviders.find(({ id }) => id === connection.provider);

	if (
		!connectionProvider ||
		(connectionProvider.identifiablePattern &&
			!connectionProvider.identifiablePattern.test(rawIdentifiable))
	) {
		return fail(400, {
			message: 'Invalid connection identifier'
		});
	}

	const matches = connectionProvider.identifiablePattern?.exec(rawIdentifiable);

	const identifiable = connectionProvider.identifiablePattern
		? // in case there's two different URL patterns for the same provider
			matches![1] || matches![2] || rawIdentifiable
		: rawIdentifiable;

	const connectionUrl = parseIdentifiableUrl(connectionProvider, rawIdentifiable);

	try {
		await db
			.update(connections)
			.set({
				label,
				identifiable,
				url: connectionUrl
			})
			.where(eq(connections.id, connectionId));
	} catch (e) {
		return fail(500, { message: String(e) });
	}

	return {};
}
