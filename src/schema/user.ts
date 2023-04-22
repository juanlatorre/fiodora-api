import { builder } from "../builder";

builder.prismaNode("User", {
  name: "User",
  description: "User schema",
  id: {
    resolve: ({ id }) => id,
  },
  findUnique: (id) => ({ id }),
  fields: (t) => ({
    name: t.exposeString("name"),
    email: t.exposeString("email"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
});
