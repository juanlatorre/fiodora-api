import {
  DateTimeResolver,
  UUIDResolver,
  NonNegativeIntResolver,
  NonNegativeFloatResolver,
  PositiveIntResolver,
  URLResolver,
  NonEmptyStringResolver,
  EmailAddressResolver,
} from "graphql-scalars";
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import ValidationPlugin from "@pothos/plugin-validation";
import ErrorsPlugin from "@pothos/plugin-errors";
import PrismaTypes from "../../../generated/photos-types";
import { prisma } from "../../prisma";

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    DateTime: {
      Output: Date;
      Input: Date;
    };
    UUID: {
      Input: string;
      Output: string;
    };
    NonNegativeInt: {
      Input: number;
      Output: number;
    };
    NonNegativeFloat: {
      Input: number;
      Output: number;
    };
    PositiveInt: {
      Input: number;
      Output: number;
    };
    URL: {
      Input: URL;
      Output: string | URL;
    };
    NonEmptyString: {
      Input: string;
      Output: string;
    };
    EmailAddress: {
      Input: string;
      Output: string;
    };
  };
}>({
  plugins: [ErrorsPlugin, PrismaPlugin, ValidationPlugin],
  prisma: {
    client: prisma,
  },
  errorOptions: {
    defaultTypes: [Error],
  },
});

builder.queryType();
// builder.mutationType();

builder.addScalarType("DateTime", DateTimeResolver, {});
builder.addScalarType("UUID", UUIDResolver, {});
builder.addScalarType("NonNegativeInt", NonNegativeIntResolver, {});
builder.addScalarType("NonNegativeFloat", NonNegativeFloatResolver, {});
builder.addScalarType("PositiveInt", PositiveIntResolver, {});
builder.addScalarType("URL", URLResolver, {});
builder.addScalarType("NonEmptyString", NonEmptyStringResolver, {});
builder.addScalarType("EmailAddress", EmailAddressResolver, {});
