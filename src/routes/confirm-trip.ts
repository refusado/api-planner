import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import 'dayjs/locale/pt-br';

export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/confirm', {
    schema: {
      params: z.object({
        tripId: z.string().uuid(),
      })
    }
  }, async (request) => {
    const tripId = request.params.tripId;

    return `Você foi ocnvidade para participar da viagem ${tripId}. Deseja aceitar?`;
  });
}