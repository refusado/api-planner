import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import 'dayjs/locale/pt-br';
import { prisma } from '../lib/prisma';
import { getMailClient } from './mail';
import { formatDate } from '../lib/dayjs';
import nodemailer from 'nodemailer';

export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/confirm', {
    schema: {
      params: z.object({
        tripId: z.string().uuid(),
      })
    }
  }, async (request, reply) => {
    const { tripId } = request.params;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        participants: {
          where: { is_owner: false }
        }
      }
    })

    if (!trip) throw new Error('Trip not found');

    const {
      id,
      is_comfirmed,
      destination,
      starts_at,
      ends_at,
      participants
    } = trip;

    if (is_comfirmed) return reply.redirect(`http://localhost:3000/trips/${id}`);

    await prisma.trip.update({
      where: { id },
      data: { is_comfirmed: true },
    });

    const mail = await getMailClient();
    
    Promise.all(
      participants.map(async ({ email, id }) => {
        const confirmationLink = `http://localhost:3333/trips/${tripId}/confirm/${id}`;

        const message = await mail.sendMail({
          from: {
            name: 'Planner Contact',
            address: 'contact@plann.er',
          },
          to: email,
          subject: `Confirme sua presença na viagem para ${destination} em ${formatDate(starts_at)}`,
          html: `
            <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
              <p>Você foi convidado para participar de uma viagem para <strong>${destination}</strong> nas datas de <strong>${formatDate(starts_at)}</strong> até <strong>${formatDate(ends_at)}</strong>.</p>
              
              <p>Para confirmar sua presença nesta viagem, clique no link abaixo:</p>
              
              <p>
                <a href="${confirmationLink}">Confirmar presença.</a>
              </p>
              
              <p>Caso você não saiba do que se trata esse e-mail, apenas ignore-o.</p>
            </div>
          `.trim()
        });

        console.log(nodemailer.getTestMessageUrl(message));
      })
    );

    return reply.redirect(`http://localhost:3000/trips/${id}`);
  });
}