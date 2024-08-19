import env from "@/env";
import { ClientError } from "@/errors/client-error";
import { formatDate } from "@/lib/dayjs";
import { getMailClient } from "@/lib/mail";
import { prisma } from '@/lib/prisma';
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import nodemailer from 'nodemailer';
import { z } from 'zod';

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/participants', {
    schema: {
      summary: 'Creates a new invite and sends the invite via email',
      tags: ['participant'],
      body: z.object({
        email: z.string().email()
      }),
      params: z.object({
        tripId: z.string().uuid()
      }),
      response: {
        201: z.object({
          createdParticipant: z.string().uuid()
        })
      }
    }
  },
  async (request, reply) => {
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
    const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`;

    const message = await mail.sendMail({
      from: {
        name: 'Planner Contact',
        address: 'contact@plann.er',
      },
      to: email,
      subject: `Confirm your attendance to ${destination} in ${formatDate(starts_at)}`,
      html: `
        <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
          <p>You have been invited to join a trip to <strong>${destination}</strong>, from <strong>${formatDate(starts_at)}</strong> to <strong>${formatDate(ends_at)}</strong>.</p>
          
          <p>To confirm your attendance for this trip, click the link below:</p>
          
          <p>
            <a href="${confirmationLink}">Confirm attendance.</a>
          </p>
          
          <p>If you are not aware of this email, simply ignore it.</p>
        </div>
      `.trim()
    });

    console.log(nodemailer.getTestMessageUrl(message));

    return reply.status(201).send({
      createdParticipant: participant.id
    });
  })
}