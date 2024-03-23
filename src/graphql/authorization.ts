import { UserRole } from "@prisma/client";
import type { Authentication } from "../auth";
import { LazyPromise } from "../helpers";
import { NotAuthorizedError } from "./schema/errors";

export const Authorization = (authentication: Authentication) => {
	const user = LazyPromise(async () => {
		const authenticatedUser = await authentication.user;
		if (!authenticatedUser) return null;
		return authenticatedUser;
	});

	const expectUser = LazyPromise(async () => {
		const authorizedUser = await user;
		if (!authorizedUser) throw new NotAuthorizedError();

		return {
			...authorizedUser,
			isAdmin: authorizedUser.role === UserRole.ADMIN,
		};
	});

	const expectAdmin = LazyPromise(async () => {
		const user = await expectUser;
		if (!user.isAdmin) throw new NotAuthorizedError();
		return user;
	});

	return {
		expectUser,
		expectAdmin,
		user,
	};
};
