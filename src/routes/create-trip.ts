import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { prisma } from '../lib/prisma';
import dayjs from 'dayjs';

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips', {
    schema: {
      body: z.object({
        destination: z.string().min(4),
        starts_at: z.coerce.date(),
        ends_at: z.coerce.date()
      })
    }
  }, async (request) => {
    const { destination, starts_at, ends_at } = request.body;

    if (dayjs(starts_at).isBefore(new Date()))
      throw new Error('Invalid trip start date');

    if (dayjs(ends_at).isBefore(dayjs(starts_at)))
      throw new Error('Invalid trip end date');

    const trip = await prisma.trip.create({
      data: {
        destination,
        starts_at,
        ends_at,
      }
    });

    return {
      createdTrip: trip.id
    };
  });
}

// curl -X POST localhost:3333/trips -H "Content-Type: application/json" -d '{ "destination": "Miami", "starts_at": "2024-12-20", "ends_at": "2024-12-27" }'