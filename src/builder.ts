import { DateTimeResolver, UUIDResolver } from "graphql-scalars";
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import RelayPlugin from "@pothos/plugin-relay";
import { db } from "./db";
import PrismaTypes from "./db/generated";

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    ID: {
      Output: string;
      Input: string;
    };
    DateTime: {
      Output: Date;
      Input: Date;
    };
  };
}>({
  plugins: [PrismaPlugin, RelayPlugin],
  relayOptions: {
    clientMutationId: "omit",
    cursorType: "String",
  },
  prisma: {
    client: db,
  },
});

builder.queryType();
// builder.mutationType();

builder.addScalarType("DateTime", DateTimeResolver, {});
builder.addScalarType("ID", UUIDResolver, {});
