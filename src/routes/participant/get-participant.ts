import { ClientError } from "@/errors/client-error";
import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export async function getParticipant(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/participant/:participant_id', {
    schema: {
      summary: 'Gets a specific participant from a trip',
      tags: ['participant'],
      params: z.object({
        participant_id: z.string().uuid()
      })
    }
  },
  async (request) => {
    const { participant_id: id } = request.params;

    const participant = await prisma.participant.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    if (!participant) throw new ClientError('Participant not found');

    return { participant }
  });
}