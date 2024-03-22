import fastify, { type FastifyRequest, type FastifyReply } from "fastify";
import { createYoga } from "graphql-yoga";
import { ENV } from "./env";
import { schema } from "./graphql/schema";

const app = fastify({
	logger: {
		transport: {
			target: "pino-pretty",
			options: {
				translateTime: "HH:MM:ss Z",
				ignore: "pid,hostname",
			},
		},
	},
});

const yoga = createYoga<{
	req: FastifyRequest;
	reply: FastifyReply;
}>({
	schema,
	logging: {
		debug: (...args) => args.forEach((arg) => app.log.debug(arg)),
		info: (...args) => args.forEach((arg) => app.log.info(arg)),
		warn: (...args) => args.forEach((arg) => app.log.warn(arg)),
		error: (...args) => args.forEach((arg) => app.log.error(arg)),
	},
});

app.route({
	url: "/",
	method: ["GET", "POST", "OPTIONS"],
	handler: async (req, reply) => {
		const response = await yoga.handleNodeRequest(req, {
			req,
			reply,
		});

		reply.status(response.status);
		reply.send(response.body);

		return reply;
	},
});

app.route({
	url: "/graphql",
	method: ["GET", "POST", "OPTIONS"],
	handler: async (req, reply) => {
		const response = await yoga.handleNodeRequest(req, {
			req,
			reply,
		});
		response.headers.forEach((value, key) => {
			reply.header(key, value);
		});

		reply.status(response.status);

		reply.send(response.body);

		return reply;
	},
});

await app.listen({ host: "0.0.0.0", port: 3000 });

console.log(`\nServer listening at http://0.0.0.0:${ENV.PORT}`);
