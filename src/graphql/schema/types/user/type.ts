import { builder } from "../../builder";
import { InferObjectType } from "../../../helpers";

export const UserRef = builder.prismaObject("User", {
  description: "User entity",
  findUnique({ id }) {
    return {
      id,
    };
  },
  fields: (t) => ({
    id: t.exposeID("id", {
      description: "User UUID",
    }),
    name: t.exposeString("name", {
      description: "User name",
    }),
    email: t.exposeString("email", {
      description: "User email",
    }),
    createdAt: t.expose("createdAt", {
      type: "DateTime",
      description: "User creation date",
    }),
    updatedAt: t.expose("updatedAt", { type: "DateTime", nullable: true }),
  }),
});

export type User = InferObjectType<typeof UserRef>;
