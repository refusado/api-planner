import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

async function createDocumentation(app: FastifyInstance) {
  app.register(fastifySwagger, {
    swagger: {
      consumes: ['application/json'],
      produces: ['application/json'],
      info: {
        title: 'Planner',
        description: 'API documentation for Planner project',
        version: '1.0.0'
      }
    },
    transform: jsonSchemaTransform
  });
  app.register(fastifySwaggerUi);
}

export default createDocumentation;