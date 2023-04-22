import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { ENV } from "./env";
import { schema } from "./schema";

const yoga = createYoga({
  schema,
});

const server = createServer(yoga);

server.listen(ENV.PORT, () => {
  console.log(`\nServer running http://0.0.0.0:${ENV.PORT}/graphql`);
});
