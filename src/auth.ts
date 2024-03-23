import jsonwebtoken from "jsonwebtoken";
import { ENV } from "./env";

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
