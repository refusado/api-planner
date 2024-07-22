import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import nodemailer from 'nodemailer';
import z from 'zod';
import { ClientError } from "../errors/client-error";
import { formatDate } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import { prisma } from '../lib/prisma';

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/participants', {
    schema: {
      body: z.object({
        email: z.string().email()
      }),
      params: z.object({
        tripId: z.string().uuid()
      })
    }
  },
  async (request) => {
    const { tripId } = request.params;
    const { email } = request.body;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId }
    });

    if (!trip) throw new ClientError('Trip not found');

    const { id: trip_id, destination, starts_at, ends_at } = trip;

    const participant = await prisma.participant.create({
      data: { trip_id, email }
    });

    const mail = await getMailClient();
    const confirmationLink = `http://localhost:3333/participants/${participant.id}/confirm`;

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


    return { createdParticipant: participant.id }
  })
}