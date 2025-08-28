import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Delete existing entries
  await knex('friends').del();

  const friends = [
    // Accepted friendships
    {
      id: 1,
      requesterId: 3, // Alice
      addresseeId: 4, // Bob
      status: 'accepted',
      created_at: new Date('2024-01-08T15:00:00Z'),
      updated_at: new Date('2024-01-08T16:30:00Z')
    },
    {
      id: 2,
      requesterId: 4, // Bob
      addresseeId: 6, // Diana
      status: 'accepted',
      created_at: new Date('2024-01-09T10:15:00Z'),
      updated_at: new Date('2024-01-09T14:20:00Z')
    },
    {
      id: 3,
      requesterId: 5, // Charlie
      addresseeId: 3, // Alice
      status: 'accepted',
      created_at: new Date('2024-01-10T09:30:00Z'),
      updated_at: new Date('2024-01-10T11:45:00Z')
    },
    {
      id: 4,
      requesterId: 6, // Diana
      addresseeId: 5, // Charlie
      status: 'accepted',
      created_at: new Date('2024-01-11T14:00:00Z'),
      updated_at: new Date('2024-01-11T15:30:00Z')
    },

    // Pending friend requests
    {
      id: 5,
      requesterId: 3, // Alice
      addresseeId: 6, // Diana
      status: 'pending',
      created_at: new Date('2024-01-12T10:00:00Z'),
      updated_at: new Date('2024-01-12T10:00:00Z')
    },
    {
      id: 6,
      requesterId: 5, // Charlie
      addresseeId: 4, // Bob
      status: 'pending',
      created_at: new Date('2024-01-12T16:30:00Z'),
      updated_at: new Date('2024-01-12T16:30:00Z')
    },

    // Declined request (example)
    {
      id: 7,
      requesterId: 4, // Bob
      addresseeId: 5, // Charlie (but Charlie has sent a request to Bob, creating an interesting dynamic)
      status: 'declined',
      created_at: new Date('2024-01-09T20:00:00Z'),
      updated_at: new Date('2024-01-09T21:15:00Z')
    }
  ];

  await knex('friends').insert(friends);
}