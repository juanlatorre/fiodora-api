import type { PrismaClient } from "@prisma/client";
import type { YogaInitialContext } from "graphql-yoga";
import type jsonwebtoken from "jsonwebtoken";
import { authentication } from "../auth";
import { prisma } from "../prisma";

export type GraphQLContext = {
	prisma: PrismaClient;
	authToken: null | jsonwebtoken.JwtPayload;
};

export async function createContext(
	initialContext: YogaInitialContext,
): Promise<GraphQLContext> {
	return {
		prisma: prisma,
		authToken: await authentication(initialContext.request),
	};
}
