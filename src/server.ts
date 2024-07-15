import fastify from 'fastify';
import cors from '@fastify/cors';
import { createTrip } from './routes/create-trip';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { confirmTrip } from './routes/confirm-trip';
import { confirmParticipant } from './routes/confirm-participant';
import { createActivity } from './routes/create-activity';
import { getActivity } from './routes/get-activities';
import { createLlink } from './routes/create-link';
import { getLinks } from './routes/get-link';

const app = fastify();

app.register(cors, {
  origin: '*'
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip);
app.register(confirmTrip);
app.register(confirmParticipant);
app.register(createActivity);
app.register(getActivity);
app.register(createLlink);
app.register(getLinks);

app.listen({ port: 3333 }).then(() => {
  console.log('server is running!');
});