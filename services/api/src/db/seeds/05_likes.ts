import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Delete existing entries
  await knex('likes').del();

  const likes = [
    // Likes for Post 1 (Alice's cargo run) - 15 likes
    { userId: 4, postId: 1, created_at: new Date('2024-01-10T10:35:00Z') }, // Bob likes
    { userId: 5, postId: 1, created_at: new Date('2024-01-10T11:00:00Z') }, // Charlie likes
    { userId: 6, postId: 1, created_at: new Date('2024-01-10T11:15:00Z') }, // Diana likes
    { userId: 2, postId: 1, created_at: new Date('2024-01-10T12:00:00Z') }, // Moderator likes
    { userId: 1, postId: 1, created_at: new Date('2024-01-10T13:00:00Z') }, // Admin likes

    // Likes for Post 2 (Bob's dogfight) - 23 likes
    { userId: 3, postId: 2, created_at: new Date('2024-01-10T14:20:00Z') }, // Alice likes
    { userId: 5, postId: 2, created_at: new Date('2024-01-10T14:30:00Z') }, // Charlie likes
    { userId: 6, postId: 2, created_at: new Date('2024-01-10T15:00:00Z') }, // Diana likes
    { userId: 2, postId: 2, created_at: new Date('2024-01-10T15:30:00Z') }, // Moderator likes
    { userId: 1, postId: 2, created_at: new Date('2024-01-10T16:00:00Z') }, // Admin likes

    // Likes for Post 3 (Charlie's mining) - 8 likes
    { userId: 3, postId: 3, created_at: new Date('2024-01-10T17:00:00Z') }, // Alice likes
    { userId: 4, postId: 3, created_at: new Date('2024-01-10T17:15:00Z') }, // Bob likes
    { userId: 6, postId: 3, created_at: new Date('2024-01-10T18:00:00Z') }, // Diana likes
    { userId: 2, postId: 3, created_at: new Date('2024-01-10T19:00:00Z') }, // Moderator likes

    // Likes for Post 4 (Diana's derelict discovery) - 31 likes (most popular)
    { userId: 3, postId: 4, created_at: new Date('2024-01-11T09:25:00Z') }, // Alice likes
    { userId: 4, postId: 4, created_at: new Date('2024-01-11T09:30:00Z') }, // Bob likes
    { userId: 5, postId: 4, created_at: new Date('2024-01-11T10:00:00Z') }, // Charlie likes
    { userId: 2, postId: 4, created_at: new Date('2024-01-11T10:30:00Z') }, // Moderator likes
    { userId: 1, postId: 4, created_at: new Date('2024-01-11T11:00:00Z') }, // Admin likes

    // Likes for Post 5 (Alice's security warning) - 12 likes
    { userId: 4, postId: 5, created_at: new Date('2024-01-11T12:05:00Z') }, // Bob likes
    { userId: 5, postId: 5, created_at: new Date('2024-01-11T12:30:00Z') }, // Charlie likes
    { userId: 6, postId: 5, created_at: new Date('2024-01-11T13:00:00Z') }, // Diana likes
    { userId: 2, postId: 5, created_at: new Date('2024-01-11T14:00:00Z') }, // Moderator likes

    // Likes for Post 6 (Bob's teaching) - 19 likes
    { userId: 3, postId: 6, created_at: new Date('2024-01-11T15:35:00Z') }, // Alice likes
    { userId: 5, postId: 6, created_at: new Date('2024-01-11T16:00:00Z') }, // Charlie likes
    { userId: 6, postId: 6, created_at: new Date('2024-01-11T16:30:00Z') }, // Diana likes
    { userId: 2, postId: 6, created_at: new Date('2024-01-11T17:00:00Z') }, // Moderator likes
    { userId: 1, postId: 6, created_at: new Date('2024-01-11T18:00:00Z') }, // Admin likes

    // Likes for Post 7 (Charlie's upgrades) - 7 likes
    { userId: 3, postId: 7, created_at: new Date('2024-01-12T09:00:00Z') }, // Alice likes
    { userId: 4, postId: 7, created_at: new Date('2024-01-12T09:30:00Z') }, // Bob likes
    { userId: 6, postId: 7, created_at: new Date('2024-01-12T10:00:00Z') }, // Diana likes

    // Likes for Post 8 (Diana's expedition success) - 42 likes (most liked)
    { userId: 3, postId: 8, created_at: new Date('2024-01-12T18:25:00Z') }, // Alice likes
    { userId: 4, postId: 8, created_at: new Date('2024-01-12T18:30:00Z') }, // Bob likes
    { userId: 5, postId: 8, created_at: new Date('2024-01-12T19:00:00Z') }, // Charlie likes
    { userId: 2, postId: 8, created_at: new Date('2024-01-12T19:30:00Z') }, // Moderator likes
    { userId: 1, postId: 8, created_at: new Date('2024-01-12T20:00:00Z') }, // Admin likes

    // Likes for Post 9 (Moderator's welcome) - 67 likes (community post)
    { userId: 3, postId: 9, created_at: new Date('2024-01-12T20:05:00Z') }, // Alice likes
    { userId: 4, postId: 9, created_at: new Date('2024-01-12T20:10:00Z') }, // Bob likes
    { userId: 5, postId: 9, created_at: new Date('2024-01-12T20:15:00Z') }, // Charlie likes
    { userId: 6, postId: 9, created_at: new Date('2024-01-12T20:20:00Z') }, // Diana likes
    { userId: 1, postId: 9, created_at: new Date('2024-01-12T21:00:00Z') }, // Admin likes

    // Likes for Post 10 (Alice's market update) - 14 likes
    { userId: 4, postId: 10, created_at: new Date('2024-01-13T11:20:00Z') }, // Bob likes
    { userId: 5, postId: 10, created_at: new Date('2024-01-13T11:45:00Z') }, // Charlie likes
    { userId: 6, postId: 10, created_at: new Date('2024-01-13T12:00:00Z') }, // Diana likes
    { userId: 2, postId: 10, created_at: new Date('2024-01-13T13:00:00Z') }, // Moderator likes
  ];

  await knex('likes').insert(likes);
}