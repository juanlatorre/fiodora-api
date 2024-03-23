import type { PrismaClient } from "@prisma/client";
import type { YogaInitialContext } from "graphql-yoga";
import { type AuthToken, Authentication } from "../auth";
import { prisma } from "../prisma";
import { Authorization } from "./authorization";

export type GraphQLContext = {
	authentication: Authentication;
	authorization: ReturnType<typeof Authorization>;
	authUser: AuthToken | null;
	prisma: PrismaClient;
};

export async function createContext(
	initialContext: YogaInitialContext,
): Promise<GraphQLContext> {
	const authentication = Authentication.fromHeaders(
		initialContext.request.headers,
	);
	const authUser = await authentication.user;

	const authorization = Authorization(authentication);

	return {
		authentication,
		authorization,
		authUser,
		prisma,
	};
}
