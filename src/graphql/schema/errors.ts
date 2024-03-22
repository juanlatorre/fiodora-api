import { ZodError } from "zod";
import { flattenErrors } from "../helpers";
import { builder } from "./builder";

const ErrorInterface = builder.interfaceRef<Error>("Error").implement({
	fields: (t) => ({
		message: t.exposeString("message"),
	}),
});

builder.objectType(Error, {
	name: "BaseError",
	interfaces: [ErrorInterface],
});

const ZodFieldError = builder
	.objectRef<{
		message: string;
		path: string[];
	}>("ZodFieldError")
	.implement({
		fields: (t) => ({
			message: t.exposeString("message"),
			path: t.exposeStringList("path"),
		}),
	});

builder.objectType(ZodError, {
	name: "ZodError",
	interfaces: [ErrorInterface],
	fields: (t) => ({
		fieldErrors: t.field({
			type: [ZodFieldError],
			resolve: (err) => flattenErrors(err.format(), []),
		}),
	}),
});
