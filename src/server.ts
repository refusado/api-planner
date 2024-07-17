import fastify from 'fastify';
import cors from '@fastify/cors';
import { createTrip } from './routes/create-trip';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { confirmTrip } from './routes/confirm-trip';
import { confirmParticipant } from './routes/confirm-participant';
import { createActivity } from './routes/create-activity';
import { getActivity } from './routes/get-activities';
import { createLink } from './routes/create-link';
import { getLinks } from './routes/get-link';
import { getParticipants } from './routes/get-participants';
import { createInvite } from './routes/create-invite';
import { updateTrip } from './routes/update-trip';
import { getTrip } from './routes/get-trip';
import { getParticipant } from './routes/get-participant';

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
app.register(createLink);
app.register(getLinks);
app.register(getParticipants);
app.register(getParticipant);
app.register(createInvite);
app.register(updateTrip);
app.register(getTrip);

app.listen({ port: 3333 }).then(() => {
  console.log('server is running!');
});