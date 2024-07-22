import cors from '@fastify/cors';
import fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { ErrorHandler } from './error-handler';
import { confirmParticipant } from './routes/confirm-participant';
import { confirmTrip } from './routes/confirm-trip';
import { createActivity } from './routes/create-activity';
import { createInvite } from './routes/create-invite';
import { createLink } from './routes/create-link';
import { createTrip } from './routes/create-trip';
import { getActivity } from './routes/get-activities';
import { getLinks } from './routes/get-link';
import { getParticipant } from './routes/get-participant';
import { getParticipants } from './routes/get-participants';
import { getTrip } from './routes/get-trip';
import { updateTrip } from './routes/update-trip';

const app = fastify();

app.register(cors, {
  origin: '*'
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(ErrorHandler);

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