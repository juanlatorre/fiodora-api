import { UserRole } from "@prisma/client";
import jsonwebtoken from "jsonwebtoken";
import { z } from "zod";
import { ENV } from "./env";
import { getTokenValue } from "./helpers";

const authTokenSchema = z.object({
	userId: z.string(),
	role: z.nativeEnum(UserRole),
	name: z.string(),
	email: z.string().email(),
});

export type AuthToken = z.infer<typeof authTokenSchema>;

export class Authentication {
	private tokenData: Promise<AuthToken | null>;

	static fromHeaders(headers: Headers): Authentication {
		const userToken = headers.get("authorization");

		return new Authentication(
			userToken && typeof userToken === "string"
				? Authentication.decryptUserToken(userToken)
				: Promise.resolve(null),
		);
	}

	private constructor(tokenData: Promise<AuthToken | null>) {
		this.tokenData = tokenData;
	}

	get user(): Promise<AuthToken | null> {
		return this.tokenData;
	}

	get hasUser(): Promise<boolean> {
		return this.tokenData.then((user) => user !== null);
	}

	setUserToken(token: string) {
		this.tokenData = Authentication.decryptUserToken(token);
	}

	private static decryptUserToken(token: string): Promise<AuthToken | null> {
		return getTokenValue(token, authTokenSchema);
	}
}

export async function authentication(
	request: Request,
): Promise<jsonwebtoken.JwtPayload | null> {
	const header = request.headers.get("authorization");

	if (!header) return null;

	const token = header.split(" ")[1];
	const tokenPayload = jsonwebtoken.verify(token, ENV.JWT_SECRET);

	if (typeof tokenPayload !== "object") return null;

	return tokenPayload;
}
