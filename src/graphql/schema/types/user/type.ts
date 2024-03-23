import type { InferObjectType } from "../../../helpers";
import { builder } from "../../builder";

export const UserRef = builder.prismaObject("User", {
	description: "User entity",
	findUnique({ id }) {
		return {
			id,
		};
	},
	fields: (t) => ({
		id: t.exposeID("id", {
			description: "User UUID",
		}),
		name: t.exposeString("name", {
			description: "User name",
		}),
		email: t.exposeString("email", {
			description: "User email",
		}),
		role: t.exposeString("role", {
			description: "User role",
		}),
		createdAt: t.expose("createdAt", {
			type: "DateTime",
			description: "User creation date",
		}),
		updatedAt: t.expose("updatedAt", { type: "DateTime", nullable: true }),
	}),
});

export type User = InferObjectType<typeof UserRef>;

export const AuthPayloadRef = builder
	.objectRef<{
		token: string;
		user?: User;
	}>("AuthPayload")
	.implement({
		description: "The payload returned when a user logs in",
		fields(t) {
			return {
				token: t.exposeID("token", {
					description: "Auth token",
				}),
				user: t.expose("user", {
					type: UserRef,
					description: "User entity",
					nullable: true,
				}),
			};
		},
	});

export type AuthPayload = InferObjectType<typeof AuthPayloadRef>;
