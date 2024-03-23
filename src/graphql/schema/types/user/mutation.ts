import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { ZodError } from "zod";
import { ENV } from "../../../../env";
import { prisma } from "../../../../prisma";
import { builder } from "../../builder";
import { AuthPayloadRef } from "./type";

// Login mutation
builder.mutationField("login", (t) =>
	t.fieldWithInput({
		type: AuthPayloadRef,
		description: "Login a user and return a token",
		input: {
			email: t.input.string({ required: true, validate: { email: true } }),
			password: t.input.string({ required: true }),
		},
		errors: {
			types: [Error, ZodError],
		},
		resolve: async (_, args) => {
			const user = await prisma.user.findUnique({
				where: { email: args.input.email },
			});

			if (!user) {
				throw new Error("Authentication failed");
			}

			const valid = await bcrypt.compare(args.input.password, user.password);

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

			return { token, user };
		},
	}),
);

// Create User mutation
builder.mutationField("createUser", (t) =>
	t.fieldWithInput({
		type: AuthPayloadRef,
		description: "Create a new user",
		input: {
			email: t.input.string({ required: true, validate: { email: true } }),
			name: t.input.string({ required: true }),
			password: t.input.string({ required: true }),
		},
		errors: {
			types: [Error, ZodError],
		},
		resolve: async (_, args) => {
			const password = await bcrypt.hash(args.input.password, 10);

			const user = await prisma.user.create({
				data: { ...args.input, password },
			});

			const token = jsonwebtoken.sign(
				{
					userId: user.id,
					role: user.role,
					name: user.name,
					email: user.email,
				},
				ENV.JWT_SECRET,
			);

			return { token, user };
		},
	}),
);
