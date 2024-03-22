import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({
	path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env"),
});

const envSchema = z.object({
	PORT: z.string().transform((value) => Number.parseInt(value)),
	DATABASE_URL: z.string().url(),
});

export type Env = z.infer<typeof envSchema>;

export const ENV: Env = envSchema.parse(process.env);
