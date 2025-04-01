import type {} from "@pothos/core";
import jsonwebtoken from "jsonwebtoken";
import type { ZodFormattedError, z } from "zod";
import { ENV } from "./env";

export type InferObjectType<T> = T extends PothosSchemaTypes.ObjectRef<
	// biome-ignore lint/correctness/noUnusedVariables: <explanation>
	infer Types,
	infer A
>
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

export async function getTokenValue<T>(token: string, schema: z.Schema<T>) {
	const decryptedToken = jsonwebtoken.verify(token, ENV.JWT_SECRET);

	if (decryptedToken == null || typeof decryptedToken === "string") return null;

	const result = schema.safeParse(decryptedToken);

	if (!result.success) return null;

	return result.data;
}

export class PLazy<ValueType> extends Promise<ValueType> {
	private _promise?: Promise<ValueType>;

	constructor(
		private _executor: (
			resolve: (value: ValueType) => void,
			reject: (err: unknown) => void,
		) => void,
	) {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		super((resolve: (v?: any) => void) => resolve());
	}

	// biome-ignore lint/suspicious/noThenProperty: <explanation>
	override then: Promise<ValueType>["then"] = (onFulfilled, onRejected) =>
		// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
		(this._promise ||= new Promise(this._executor)).then(
			onFulfilled,
			onRejected,
		);

	override catch: Promise<ValueType>["catch"] = (onRejected) =>
		// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
		(this._promise ||= new Promise(this._executor)).catch(onRejected);

	override finally: Promise<ValueType>["finally"] = (onFinally) =>
		// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
		(this._promise ||= new Promise(this._executor)).finally(onFinally);
}

export function LazyPromise<Value>(
	fn: () => Value | Promise<Value>,
): Promise<Value> {
	return new PLazy((resolve, reject) => {
		try {
			Promise.resolve(fn()).then(resolve, reject);
		} catch (err) {
			reject(err);
		}
	});
}
