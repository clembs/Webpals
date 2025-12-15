import type { inviteCodes } from './schema/auth';
import type { notifications, notificationsMentionedProfiles } from './schema/notifications';
import type { profiles, relationships, connections } from './schema/profiles';

export type BaseProfile = typeof profiles.$inferSelect;

export type Profile = typeof profiles.$inferSelect & {
	connections: Connection[];
	initiatedRelationships: (Relationship & {
		recipient: BaseProfile;
	})[];
};

export type CurrentProfile = Profile & {
	notifications: Notification[];
	receivedRelationships: (Relationship & {
		profile: BaseProfile;
	})[];
};

export type Relationship = typeof relationships.$inferSelect;

export type Connection = typeof connections.$inferSelect;

export type InviteCode = typeof inviteCodes.$inferSelect;

export type Notification = typeof notifications.$inferSelect & {
	mentionedProfiles: (typeof notificationsMentionedProfiles.$inferSelect & {
		profile: BaseProfile | undefined | null;
	})[];
};
