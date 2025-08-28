import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Delete existing entries
  await knex('follows').del();

  const follows = [
    // Alice follows others
    { followerId: 3, followingId: 4, created_at: new Date('2024-01-07T10:00:00Z') }, // Alice follows Bob
    { followerId: 3, followingId: 6, created_at: new Date('2024-01-07T10:01:00Z') }, // Alice follows Diana
    { followerId: 3, followingId: 2, created_at: new Date('2024-01-07T10:02:00Z') }, // Alice follows Moderator

    // Bob follows others
    { followerId: 4, followingId: 3, created_at: new Date('2024-01-08T09:00:00Z') }, // Bob follows Alice
    { followerId: 4, followingId: 5, created_at: new Date('2024-01-08T09:01:00Z') }, // Bob follows Charlie
    { followerId: 4, followingId: 6, created_at: new Date('2024-01-08T09:02:00Z') }, // Bob follows Diana
    { followerId: 4, followingId: 2, created_at: new Date('2024-01-08T09:03:00Z') }, // Bob follows Moderator

    // Charlie follows others
    { followerId: 5, followingId: 3, created_at: new Date('2024-01-09T14:00:00Z') }, // Charlie follows Alice
    { followerId: 5, followingId: 4, created_at: new Date('2024-01-09T14:01:00Z') }, // Charlie follows Bob
    { followerId: 5, followingId: 2, created_at: new Date('2024-01-09T14:02:00Z') }, // Charlie follows Moderator

    // Diana follows others
    { followerId: 6, followingId: 3, created_at: new Date('2024-01-10T16:00:00Z') }, // Diana follows Alice
    { followerId: 6, followingId: 4, created_at: new Date('2024-01-10T16:01:00Z') }, // Diana follows Bob
    { followerId: 6, followingId: 5, created_at: new Date('2024-01-10T16:02:00Z') }, // Diana follows Charlie
    { followerId: 6, followingId: 2, created_at: new Date('2024-01-10T16:03:00Z') }, // Diana follows Moderator

    // Moderator follows community members
    { followerId: 2, followingId: 3, created_at: new Date('2024-01-11T08:00:00Z') }, // Moderator follows Alice
    { followerId: 2, followingId: 4, created_at: new Date('2024-01-11T08:01:00Z') }, // Moderator follows Bob
    { followerId: 2, followingId: 5, created_at: new Date('2024-01-11T08:02:00Z') }, // Moderator follows Charlie
    { followerId: 2, followingId: 6, created_at: new Date('2024-01-11T08:03:00Z') }, // Moderator follows Diana

    // Admin follows everyone
    { followerId: 1, followingId: 2, created_at: new Date('2024-01-01T12:00:00Z') }, // Admin follows Moderator
    { followerId: 1, followingId: 3, created_at: new Date('2024-01-01T12:01:00Z') }, // Admin follows Alice
    { followerId: 1, followingId: 4, created_at: new Date('2024-01-01T12:02:00Z') }, // Admin follows Bob
    { followerId: 1, followingId: 5, created_at: new Date('2024-01-01T12:03:00Z') }, // Admin follows Charlie
    { followerId: 1, followingId: 6, created_at: new Date('2024-01-01T12:04:00Z') }, // Admin follows Diana
  ];

  await knex('follows').insert(follows);
}