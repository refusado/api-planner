import { prisma } from "@/lib/prisma";

async function seed() {
  await prisma.trip.create({
    data: {
      id: '9ff90e28-297b-404c-8a4c-b36637ddcf0c',
      destination: 'Paris',
      starts_at: '2024-08-01T09:00:00Z',
      ends_at: '2024-08-07T21:00:00Z',
      is_comfirmed: true,
      created_at: '2024-07-01T21:00:00Z',
      participants: {
        create: [
          {
            id: 'be526645-0155-4bde-9d58-95e538e50b73',
            name: 'Alice Johnson',
            email: 'alice@example.com',
            is_confirmed: true,
            is_owner: true,
          },
          {
            id: '1e6b1158-6697-4613-ba39-5241ff5d7cec',
            name: 'Bob Smith',
            email: 'bob@example.com',
            is_confirmed: false,
            is_owner: false,
          },
        ],
      },
      activities: {
        create: [
          {
            id: '63f1bd58-ef6a-4ec6-9745-0eef90c4cd49',
            title: 'Eiffel Tower Visit',
            occurs_at: '2024-08-02T10:00:00Z',
          },
          {
            id: '98a4b815-701f-444f-9a4f-415458b16d4f',
            title: 'Louvre Museum Tour',
            occurs_at: '2024-08-03T14:00:00Z',
          },
        ],
      },
      links: {
        create: [
          {
            id: '2d6965e2-8828-4443-b2b7-24266c7ed551',
            title: 'Eiffel Tower Official Site',
            url: 'https://www.toureiffel.paris/en',
          },
          {
            id: '7a7d752c-8c3e-40e9-9441-286eaa8a25c2',
            title: 'Louvre Museum Official Site',
            url: 'https://www.louvre.fr/en',
          },
        ],
      },
    },
  });
}

seed()
  .then(() => console.log('Database seeded.'))
  .catch(error => console.log(error))
  .finally(async () => await prisma.$disconnect());