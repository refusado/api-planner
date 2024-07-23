import 'dayjs/locale/pt-br';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { ClientError } from "../errors/client-error";
import { prisma } from '../lib/prisma';
import env from '../env';

export async function confirmParticipant(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/participants/:participantId/confirm', {
    schema: {
      params: z.object({
        participantId: z.string().uuid()
      })
    }
  },
  async (request, reply) => {
    const { participantId } = request.params;

    const participant = await prisma.participant.findUnique({
      where: { id: participantId }
    });

    if (!participant) throw new ClientError('Participant not found');

    const { is_confirmed, trip_id } = participant;

    const tripLink = `${env.WEB_BASE_URL}/trips/${trip_id}`;

    if (is_confirmed) return reply.redirect(tripLink);

    await prisma.participant.update({
      where: { id: participantId },
      data: { is_confirmed: true }
    });
    
    return reply.redirect(tripLink);
  });
}