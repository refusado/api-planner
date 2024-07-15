import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { prisma } from '../lib/prisma';
import { dayjs } from '../lib/dayjs';

export async function getActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/activities', {
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
        activities: true
      }
    })

    if (!trip) throw new Error('Trip not found');

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