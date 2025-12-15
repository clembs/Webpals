import { db } from '$lib/db';

export async function getValidInviteCode(inputCode: string) {
	// const dbInviteCode = await db.query.inviteCodes.findFirst({
	// 	where: ({ code, claimedAt }, { isNull, eq, and }) => and(eq(code, inputCode), isNull(claimedAt))
	// });

	// return dbInviteCode;
	return { code: inputCode };
}
