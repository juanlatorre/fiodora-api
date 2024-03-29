import SchemaBuilder from "@pothos/core";
import ErrorsPlugin from "@pothos/plugin-errors";
import PrismaPlugin from "@pothos/plugin-prisma";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import ValidationPlugin from "@pothos/plugin-validation";
import WithInputPlugin from "@pothos/plugin-with-input";
import { UserRole } from "@prisma/client";
import {
	DateTimeResolver,
	EmailAddressResolver,
	NonEmptyStringResolver,
	NonNegativeFloatResolver,
	NonNegativeIntResolver,
	PositiveIntResolver,
	URLResolver,
	UUIDResolver,
} from "graphql-scalars";
import type PrismaTypes from "../../../generated/photos-types";
import { prisma } from "../../prisma";
import type { GraphQLContext } from "../context";
import { NotAuthorizedError } from "./errors";

export const builder = new SchemaBuilder<{
	Context: GraphQLContext;
	PrismaTypes: PrismaTypes;
	AuthScopes: {
		isAuthenticated: boolean;
		isAdmin: boolean;
	};
	Scalars: {
		DateTime: {
			Output: Date;
			Input: Date;
		};
		UUID: {
			Input: string;
			Output: string;
		};
		NonNegativeInt: {
			Input: number;
			Output: number;
		};
		NonNegativeFloat: {
			Input: number;
			Output: number;
		};
		PositiveInt: {
			Input: number;
			Output: number;
		};
		URL: {
			Input: URL;
			Output: string | URL;
		};
		NonEmptyString: {
			Input: string;
			Output: string;
		};
		EmailAddress: {
			Input: string;
			Output: string;
		};
	};
}>({
	plugins: [
		ErrorsPlugin,
		PrismaPlugin,
		ValidationPlugin,
		ScopeAuthPlugin,
		WithInputPlugin,
	],
	prisma: {
		client: prisma,
	},
	errorOptions: {
		defaultTypes: [Error],
	},
	scopeAuthOptions: {
		unauthorizedError: () => new NotAuthorizedError(),
	},
	authScopes({ authentication, authorization }) {
		return {
			isAuthenticated() {
				return authentication.hasUser;
			},
			async isAdmin() {
				return await authorization.user.then(
					(user) => user?.role === UserRole.ADMIN,
				);
			},
		};
	},
});

builder.queryType();
builder.mutationType();

builder.addScalarType("DateTime", DateTimeResolver, {});
builder.addScalarType("UUID", UUIDResolver, {});
builder.addScalarType("NonNegativeInt", NonNegativeIntResolver, {});
builder.addScalarType("NonNegativeFloat", NonNegativeFloatResolver, {});
builder.addScalarType("PositiveInt", PositiveIntResolver, {});
builder.addScalarType("URL", URLResolver, {});
builder.addScalarType("NonEmptyString", NonEmptyStringResolver, {});
builder.addScalarType("EmailAddress", EmailAddressResolver, {});
