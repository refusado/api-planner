import { ClientError } from "@/errors/client-error";
import { dayjs } from '@/lib/dayjs';
import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export async function getActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/activities', {
    schema: {
      summary: 'Gets all activities from a trip',
      tags: ['activity'],
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
        activities: {
          orderBy: {
            occurs_at: 'asc'
          }
        }
      }
    })

    if (!trip) throw new ClientError('Trip not found');

    const {
      starts_at,
      ends_at,
      activities
    } = trip;

    const tripDurationDays = dayjs(ends_at).diff(starts_at, 'days') + 1;

    const activitiesByDays = Array.from({ length: tripDurationDays })
      .map((_, i) => {
        const date = dayjs(starts_at).add(i, 'days');
        
        return {
          date,
          activities: activities.filter(({ occurs_at }) => {
            return dayjs(date).isSame(occurs_at, 'day')
          })
        }
      });

    return { activities: activitiesByDays };
  });
}