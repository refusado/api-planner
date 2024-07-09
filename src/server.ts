import fastify from "fastify";
import { prisma } from "./lib/prisma";

const app = fastify();

app.get('/test', () => {
  console.log('testing route. Everything is ok! :)');
  return 'Hello, test!!!'
});

app.get('/cadastrar', async () => {
  await prisma.trip.create({
    data: {
      destination: 'Belo horizonte',
      starts_at: new Date(),
      ends_at: new Date()
    }
  })

  return 'Cadastrado com sucesso'
});

app.get('/listar', async () => {
  const trips = await prisma.trip.findMany()

  return trips
});

app.listen({ port: 3333 }).then(() => {
  console.log('server is running!');
});