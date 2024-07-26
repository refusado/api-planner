import cors from '@fastify/cors';
import fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import env from '@/env';
import { ErrorHandler } from '@/error-handler';
import routes from '@/routes';
import createDocumentation from '@/swagger';

const app = fastify();
app.register(cors, {
  origin: '*'
});

createDocumentation(app);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(ErrorHandler);
app.register(routes);

app.get('/', (_, reply) => reply.send({
    success: true,
    message: 'Server is running',
    documentation: `${env.API_BASE_URL}/documentation`
  })
);

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server is running on port ${env.PORT}`);
  console.log(`URL: ${env.API_BASE_URL}`);
});