import { ClientError } from "@/errors/client-error";
import { dayjs } from '@/lib/dayjs';
import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export async function updateTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put('/trips/:tripId', {
    schema: {
      summary: 'Updates the information about the specified trip',
      tags: ['trip'],
      body: z.object({
        destination: z.string().min(4).optional(),
        starts_at: z.coerce.date(),
        ends_at: z.coerce.date(),
      }),
      params: z.object({
        tripId: z.string().uuid()
      })
    }
  },
  async (request) => {
    const { destination, starts_at, ends_at } = request.body;
    const { tripId: trip_id } = request.params;

    const trip = await prisma.trip.findUnique({
      where: { id: trip_id }
    })

    if (!trip) throw new ClientError('Trip not found');
    
    if (dayjs(starts_at).isBefore(new Date()))
      throw new ClientError('Invalid trip start date');

    if (dayjs(ends_at).isBefore(dayjs(starts_at)))
      throw new ClientError('Invalid trip end date');

    const updatedTrip = await prisma.trip.update({
      where: {
        id: trip_id,
      },
      data: {
        destination: destination || trip.destination,
        starts_at,
        ends_at,
      },
    });

    return { updatedTrip }
  });
}