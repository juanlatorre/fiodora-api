import type {} from "@pothos/core";
import { ZodFormattedError } from "zod";

export type InferObjectType<T> = T extends PothosSchemaTypes.ObjectRef<infer A> ? A : never;

export function flattenErrors(
  error: ZodFormattedError<unknown>,
  path: string[],
): { path: string[]; message: string }[] {
  // eslint-disable-next-line no-underscore-dangle
  const errors = error._errors.map((message) => ({
    path,
    message,
  }));

  Object.keys(error).forEach((key) => {
    if (key !== "_errors") {
      errors.push(
        ...flattenErrors((error as Record<string, unknown>)[key] as ZodFormattedError<unknown>, [
          ...path,
          key,
        ]),
      );
    }
  });

  return errors;
}
