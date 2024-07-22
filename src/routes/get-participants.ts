import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { ClientError } from "../errors/client-error";
import { prisma } from '../lib/prisma';

export async function getParticipants(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/participants', {
    schema: {
      params: z.object({
        tripId: z.string().uuid()
      })
    }
  }, async (request) => {
    const { tripId: trip_id } = request.params;

    // ordernar atividades para receber as mais recentes primeiro / ordem crescente
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