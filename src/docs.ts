import { FastifyInstance } from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifySwagger from "@fastify/swagger";

async function createDocumentation(app: FastifyInstance) {
  await app.register(fastifySwagger, {
    swagger: {
      consumes: ['application/json'],
      produces: ['application/json'],
      info: {
        title: 'Planner API',
        description: 'API documentation for the project Planner',
        version: '1.0.0'
      }
    },
    transform: jsonSchemaTransform
  });
  await app.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
  });
}

export default createDocumentation;