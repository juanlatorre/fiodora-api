import "./errors";
import "./types/index";

import { builder } from "./builder";

export const schema = builder.toSchema();
