import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { ClientError } from "@/errors/client-error";
import { dayjs } from '@/lib/dayjs';
import { prisma } from '@/lib/prisma';

export async function createActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/activities', {
    schema: {
      body: z.object({
        title: z.string().min(3),
        occurs_at: z.coerce.date()
      }),
      params: z.object({
        tripId: z.string().uuid()
      }),
      response: {
        201: z.object({
          createdActivity: z.string().uuid()
        })
      }
    }
  },
  async (request, reply) => {
    const { title, occurs_at } = request.body;
    const { tripId: trip_id } = request.params;

    const trip = await prisma.trip.findUnique({
      where: { id: trip_id }
    })

    if (!trip) throw new ClientError('Trip not found');

    if (
      dayjs(occurs_at).isBefore(trip.starts_at) ||
      dayjs(occurs_at).isAfter(trip.ends_at)
    ) throw new ClientError('Invalid activity date');

    const activity = await prisma.activity.create({
      data: { trip_id, title, occurs_at }
    })

    return reply.status(201).send({
      createdActivity: activity.id
    });
  });
}