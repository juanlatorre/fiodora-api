import dotenv from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

dotenv.config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env"),
});

const envSchema = z.object({
  PORT: z.string().transform((value) => parseInt(value)),
  DATABASE_URL: z.string().url(),
});

export type Env = z.infer<typeof envSchema>;

export const ENV: Env = envSchema.parse(process.env);
