import { FastifyInstance } from 'fastify';

import { confirmTrip } from './trip/confirm-trip';
import { createTrip } from './trip/create-trip';
import { getTrip } from './trip/get-trip';
import { updateTrip } from './trip/update-trip';

import { confirmParticipant } from './participant/confirm-participant';
import { createInvite } from './participant/create-invite';
import { getParticipant } from './participant/get-participant';
import { getParticipants } from './participant/get-participants';

import { createActivity } from './activity/create-activity';
import { getActivity } from './activity/get-activities';

import { createLink } from './link/create-link';
import { getLinks } from './link/get-link';

async function routes(app: FastifyInstance) {
  // trip routes
  app.register(createTrip);
  app.register(getTrip);
  app.register(confirmTrip);
  app.register(updateTrip);

  // participant routes
  app.register(confirmParticipant);
  app.register(createInvite);
  app.register(getParticipant);
  app.register(getParticipants);

  // activity routes
  app.register(createActivity);
  app.register(getActivity);

  // link routes
  app.register(createLink);
  app.register(getLinks);
}

export default routes;