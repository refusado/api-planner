import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { ClientError } from "@/errors/client-error";

type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const ErrorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Data sent is not in a valid format.',
      error: error.flatten()

      // Status: 400 Bad Request
      // Body: {
      //   "message": "Data sent is not in a valid format.",
      //   "error": {
      //     "formErrors": [],
      //     "fieldErrors": {
      //       "ends_at": [
      //         "Invalid date"
      //       ]
      //     }
      //   }
      // }
    });
  }

  if (error instanceof ClientError) {
    return reply.status(400).send({
      message: error.message

      // Status: 400 Bad Request
      // Body: {
      //   "message": "Trip not found"
      // }
    });
  }

  // uncaught errors
  return reply.status(500).send({ message: 'Internal server error' });
}