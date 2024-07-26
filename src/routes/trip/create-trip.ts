import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import nodemailer from 'nodemailer';
import z from 'zod';
import { ClientError } from "@/errors/client-error";
import { dayjs, formatDate } from '@/lib/dayjs';
import { getMailClient } from '@/lib/mail';
import { prisma } from '@/lib/prisma';
import env from '@/env';

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips', {
    schema: {
      body: z.object({
        destination: z.string().min(4),
        starts_at: z.coerce.date(),
        ends_at: z.coerce.date(),
        owner_name: z.string(),
        owner_email: z.string().email(),
        emails_to_invite: z.array(z.string().email())
      }),
      response: {
        201: z.object({
          createdTrip: z.string().uuid()
        })
      }
    }
  },
  async (request, reply) => {
    const {
      destination,
      starts_at,
      ends_at,
      owner_name,
      owner_email,
      emails_to_invite
    } = request.body;

    if (dayjs(starts_at).isBefore(new Date()))
      throw new ClientError('Invalid trip start date');

    if (dayjs(ends_at).isBefore(dayjs(starts_at)))
      throw new ClientError('Invalid trip end date');

    const trip = await prisma.trip.create({
      data: {
        destination,
        starts_at,
        ends_at,
        participants: {
          createMany: {
            data: [
              {
                name: owner_name,
                email: owner_email,
                is_confirmed: true,
                is_owner: true,
              },
              ...emails_to_invite.map(email => {
                return { email }
              })
            ]
          }
        }
      }
    });
    
    const mail = await getMailClient();
    const confirmationLink = `${env.API_BASE_URL}/trips/${trip.id}/confirm`;
    
    const message = await mail.sendMail({
      from: {
        name: 'Planner Contact',
        address: 'contact@plann.er',
      },
      to: {
        name: owner_name,
        address: owner_email,
      },
      subject: `Confirm trip to ${destination} in ${formatDate(starts_at)}`,
      html: `
        <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
          <p>You requested the creation of a trip to <strong>${destination}</strong> from <strong>${formatDate(starts_at)}</strong> to <strong>${formatDate(ends_at)}</strong>.</p>
          
          <p>To confirm your trip, click the link below:</p>
          
          <p>
            <a href="${confirmationLink}">Confirm trip</a>
          </p>
          
          <p>If you are not aware of this email, simply ignore it.</p>
        </div>
      `.trim()
    });

    console.log(nodemailer.getTestMessageUrl(message));
    
    return reply.status(201).send({
      createdTrip: trip.id
    });
  });
}