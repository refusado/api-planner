import { FastifyInstance } from 'fastify';

import { createTrip } from './trip/create-trip';
import { confirmTrip } from './trip/confirm-trip';
import { confirmParticipant } from './participant/confirm-participant';
import { createActivity } from './activity/create-activity';
import { getActivity } from './activity/get-activities';
import { createLink } from './link/create-link';
import { getLinks } from './link/get-link';
import { getParticipants } from './participant/get-participants';
import { getParticipant } from './participant/get-participant';
import { createInvite } from './participant/create-invite';
import { updateTrip } from './trip/update-trip';
import { getTrip } from './trip/get-trip';

async function routes(app: FastifyInstance) {
  // trip routes
  app.register(createTrip);
  app.register(confirmTrip);
  app.register(updateTrip);
  app.register(getTrip);

  // participant routes
  app.register(confirmParticipant);
  app.register(getParticipants);
  app.register(getParticipant);
  app.register(createInvite);

  // activity routes
  app.register(createActivity);
  app.register(getActivity);

  // link routes
  app.register(createLink);
  app.register(getLinks);
}

export default routes;