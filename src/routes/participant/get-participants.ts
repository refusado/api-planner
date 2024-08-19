import { ClientError } from "@/errors/client-error";
import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export async function getParticipants(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/participants', {
    schema: {
      summary: 'Gets all participants from a trip',
      tags: ['participant'],
      params: z.object({
        tripId: z.string().uuid()
      })
    }
  },
  async (request) => {
    const { tripId: trip_id } = request.params;

    const trip = await prisma.trip.findUnique({
      where: { id: trip_id },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            is_confirmed: true
          }
        }
      }
    })

    if (!trip) throw new ClientError('Trip not found');

    return { participants: trip.participants };
  });
}