import { prisma } from "../../../../prisma";
import { builder } from "../../builder";

builder.queryField("user", (t) =>
  t.prismaField({
    type: "User",
    nullable: true,
    description: "Get user by id",
    args: {
      id: t.arg({
        type: "UUID",
        required: true,
        validate: {
          uuid: [true, { message: "Must provide a valid UUID" }],
        },
      }),
    },
    resolve(query, _root, { id }) {
      return prisma.user.findUnique({
        ...query,
        where: {
          id,
        },
      });
    },
  }),
);
