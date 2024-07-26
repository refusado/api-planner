import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { ClientError } from "@/errors/client-error";
import { prisma } from '@/lib/prisma';

export async function createLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/links', {
    schema: {
      body: z.object({
        title: z.string().min(3),
        url: z.string().url()
      }),
      params: z.object({
        tripId: z.string().uuid()
      }),
      response: {
        201: z.object({
          createdLink: z.string().uuid()
        })
      }
    }
  },
  async (request, reply) => {
    const { tripId } = request.params;
    const { title, url } = request.body;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId }
    });

    if (!trip) throw new ClientError('Trip not found');

    const link = await prisma.link.create({
      data: { title, url, trip_id: tripId }
    });

    return reply.status(201).send({
      createdLink: link.id
    });
  })
}