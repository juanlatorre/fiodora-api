import { prisma } from "../../../../prisma";
import { builder } from "../../builder";

builder.queryField("user", (t) =>
  t.prismaField({
    type: "User",
    description: "Get user by id",
    errors: {
      types: [Error],
    },
    args: {
      id: t.arg({
        type: "UUID",
        required: true,
        validate: {
          uuid: [true, { message: "Must provide a valid UUID" }],
        },
      }),
    },
    async resolve(query, _root, { id }) {
      const user = await prisma.user.findUnique({
        ...query,
        where: {
          id,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    },
  }),
);
