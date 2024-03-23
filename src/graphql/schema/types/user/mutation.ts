import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { ZodError } from "zod";
import { ENV } from "../../../../env";
import { prisma } from "../../../../prisma";
import type { InferObjectType } from "../../../helpers";
import { builder } from "../../builder";

export const AuthPayloadRef = builder
	.objectRef<{
		token: string;
	}>("AuthPayload")
	.implement({
		description: "The payload returned when a user logs in",
		fields(t) {
			return {
				token: t.exposeID("token", {
					description: "Auth token",
				}),
			};
		},
	});

export type AuthPayload = InferObjectType<typeof AuthPayloadRef>;

builder.mutationField("login", (t) =>
	t.fieldWithInput({
		type: AuthPayloadRef,
		input: {
			email: t.input.string({ required: true, validate: { email: true } }),
			password: t.input.string({ required: true }),
		},
		errors: {
			types: [Error, ZodError],
		},
		resolve: async (_root, args) => {
			const { email, password } = args.input;

			const user = await prisma.user.findUnique({
				where: { email },
			});

			if (!user) {
				throw new Error("Authentication failed");
			}

			const valid = await bcrypt.compare(password, user.password);

			if (!valid) {
				throw new Error("Authentication failed");
			}

			const token = jsonwebtoken.sign(
				{
					userId: user.id,
					role: user.role,
					name: user.name,
					email: user.email,
				},
				ENV.JWT_SECRET,
			);

			return { token };
		},
	}),
);
