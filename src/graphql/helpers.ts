import type {} from "@pothos/core";
import type { ZodFormattedError } from "zod";

export type InferObjectType<T> = T extends PothosSchemaTypes.ObjectRef<infer A>
	? A
	: never;

export function flattenErrors(
	error: ZodFormattedError<unknown>,
	path: string[],
): { path: string[]; message: string }[] {
	// eslint-disable-next-line no-underscore-dangle
	const errors = error._errors.map((message) => ({
		path,
		message,
	}));

	for (const key of Object.keys(error)) {
		if (key !== "_errors") {
			errors.push(
				...flattenErrors(
					(error as Record<string, unknown>)[key] as ZodFormattedError<unknown>,
					[...path, key],
				),
			);
		}
	}

	return errors;
}
