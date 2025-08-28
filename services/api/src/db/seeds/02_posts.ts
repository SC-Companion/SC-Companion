import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Delete existing entries
  await knex('posts').del();

  const posts = [
    {
      id: 1,
      userId: 3, // Alice
      content: 'Just completed my first cargo run from ArcCorp to Hurston! The views along the way were absolutely breathtaking. Star Citizen never fails to amaze me with its beauty. 🚀 #StarCitizen #Trading',
      likesCount: 15,
      created_at: new Date('2024-01-10T10:30:00Z'),
      updated_at: new Date('2024-01-10T10:30:00Z')
    },
    {
      id: 2,
      userId: 4, // Bob
      content: 'Had an epic dogfight in my Gladius today! Three pirates vs me, and I managed to take them all down. Practice makes perfect! Who wants to join me for some combat training? 💪',
      likesCount: 23,
      created_at: new Date('2024-01-10T14:15:00Z'),
      updated_at: new Date('2024-01-10T14:15:00Z')
    },
    {
      id: 3,
      userId: 5, // Charlie
      content: 'Found a new mining spot with some excellent Quantainium deposits. Location: [CLASSIFIED] 😉 But seriously, the asteroid fields near Yela are goldmines if you know where to look!',
      likesCount: 8,
      created_at: new Date('2024-01-10T16:45:00Z'),
      updated_at: new Date('2024-01-10T16:45:00Z')
    },
    {
      id: 4,
      userId: 6, // Diana
      content: 'Discovered what looks like an unmarked derelict ship near the edge of the Stanton system. Planning to investigate tomorrow with my org. Any explorers want to join? Could be dangerous but potentially rewarding! 🔍',
      mediaUrls: JSON.stringify(['https://example.com/derelict1.jpg', 'https://example.com/derelict2.jpg']),
      likesCount: 31,
      created_at: new Date('2024-01-11T09:20:00Z'),
      updated_at: new Date('2024-01-11T09:20:00Z')
    },
    {
      id: 5,
      userId: 3, // Alice
      content: 'PSA: Hurston security is extra vigilant today. Saw multiple ships getting scanned at checkpoints. Make sure your cargo is legitimate, citizens! 🚨',
      likesCount: 12,
      created_at: new Date('2024-01-11T12:00:00Z'),
      updated_at: new Date('2024-01-11T12:00:00Z')
    },
    {
      id: 6,
      userId: 4, // Bob
      content: 'Teaching some new pilots the basics of atmospheric flight today. Nothing beats the feeling of helping newcomers find their space legs! If you are new and need help, don not hesitate to ask the community. We are all here to help each other succeed in the verse! ✈️',
      likesCount: 19,
      created_at: new Date('2024-01-11T15:30:00Z'),
      updated_at: new Date('2024-01-11T15:30:00Z')
    },
    {
      id: 7,
      userId: 5, // Charlie
      content: 'My Prospector is finally fully upgraded! New mining laser, better refinement equipment, and enhanced storage. Ready to tackle those Grade A asteroids! 💎',
      mediaUrls: JSON.stringify(['https://example.com/prospector_upgrade.jpg']),
      likesCount: 7,
      created_at: new Date('2024-01-12T08:45:00Z'),
      updated_at: new Date('2024-01-12T08:45:00Z')
    },
    {
      id: 8,
      userId: 6, // Diana
      content: 'Update on the derelict ship: We found it! Turns out it was an old Caterpillar with some valuable salvage. The exploration paid off. Sometimes the biggest risks lead to the best rewards. Thanks to everyone who joined the expedition! 🎉',
      mediaUrls: JSON.stringify(['https://example.com/caterpillar_found.jpg']),
      likesCount: 42,
      created_at: new Date('2024-01-12T18:20:00Z'),
      updated_at: new Date('2024-01-12T18:20:00Z')
    },
    {
      id: 9,
      userId: 2, // Moderator
      content: 'Welcome to all our new SC Companion members! Remember to be respectful, help each other out, and most importantly - have fun exploring the verse together. If you have any questions or need assistance, don not hesitate to reach out to the moderation team. Fly safe, citizens! 🌟',
      likesCount: 67,
      created_at: new Date('2024-01-12T20:00:00Z'),
      updated_at: new Date('2024-01-12T20:00:00Z')
    },
    {
      id: 10,
      userId: 3, // Alice
      content: 'Market update: Medical supplies are in high demand at Everus Harbor right now. Good opportunity for traders looking for profitable routes. I just made a nice profit running meds from Area18! 💰',
      likesCount: 14,
      created_at: new Date('2024-01-13T11:15:00Z'),
      updated_at: new Date('2024-01-13T11:15:00Z')
    }
  ];

  await knex('posts').insert(posts);
}