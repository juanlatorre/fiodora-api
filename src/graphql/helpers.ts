import type {} from "@pothos/core";

export type InferObjectType<T> = T extends PothosSchemaTypes.ObjectRef<infer A> ? A : never;
