import { FastifyInstance } from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

import fastifySwagger from "@fastify/swagger";

import fastifyScalar from '@scalar/fastify-api-reference';
import fastifySwaggerUi from '@fastify/swagger-ui';

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
  })

  await app.register(fastifySwaggerUi, {
    routePrefix: '/documentation-old',
  });

  await app.register(fastifyScalar, {
    routePrefix: "/documentation",
    configuration: {
      // layout: 'classic',
      hideModels: false,
      metaData: {
        title: 'Planner - API Reference',
        description: 'API reference for the project Planner',
      },
      customCss: `
      :root {
        scroll-behavior: smooth
      }

      a[data-v-bfb18750=""] {
        pointer-events: none;
        cursor: default;
        background-color: red;
        opacity: 0 !important;
        height: 0.25rem;
      }
      `,
      theme: 'deepSpace' // alternate, default, moon, purple, solarized, bluePlanet, saturn, kepler, mars, deepSpace, none
    }
  });
}

export default createDocumentation;