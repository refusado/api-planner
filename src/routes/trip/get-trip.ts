import { ClientError } from "@/errors/client-error";
import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export async function getTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId', {
    schema: {
      params: z.object({
        tripId: z.string().uuid()
      })
    }
  },
  async (request) => {
    const { tripId: trip_id } = request.params;

    const trip = await prisma.trip.findUnique({
      where: { id: trip_id },
    })

    if (!trip) throw new ClientError('Trip not found');

    return { trip };
  });
}