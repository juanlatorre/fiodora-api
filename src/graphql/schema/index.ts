import "./types/index";
import "./errors";

import { builder } from "./builder";

export const schema = builder.toSchema();
