const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Delete existing entries
  await knex('users').del();

  const passwordHash = await bcrypt.hash('password123', 12);

  const users = [
    {
      id: 1,
      handle: 'admin',
      displayName: 'Super Administrator',
      email: 'admin@sc-companion.com',
      passwordHash,
      bio: 'Super administrator of SC Companion',
      location: 'Stanton System',
      rsi_handle: 'SCCompanionAdmin',
      role: 'super_admin',
      xp: 10000,
      isPremium: true,
      created_at: new Date('2024-01-01'),
      updated_at: new Date('2024-01-01')
    },
    {
      id: 2,
      handle: 'moderator1',
      displayName: 'Community Moderator',
      email: 'moderator@sc-companion.com',
      passwordHash,
      bio: 'Keeping the community safe and friendly',
      location: 'Terra System',
      rsi_handle: 'SCModerator',
      role: 'moderator',
      xp: 5000,
      isPremium: true,
      created_at: new Date('2024-01-02'),
      updated_at: new Date('2024-01-02')
    },
    {
      id: 3,
      handle: 'citizen_alice',
      displayName: 'Alice StarWalker',
      email: 'alice@example.com',
      passwordHash,
      bio: 'Freelance trader exploring the verse',
      location: 'ArcCorp, Stanton',
      rsi_handle: 'AliceStarWalker',
      rsi_geid: 'GEID_Alice_12345',
      role: 'user',
      xp: 2500,
      isPremium: false,
      created_at: new Date('2024-01-03'),
      updated_at: new Date('2024-01-03')
    },
    {
      id: 4,
      handle: 'pilot_bob',
      displayName: 'Bob "Ace" Johnson',
      email: 'bob@example.com',
      passwordHash,
      bio: 'Professional pilot and dogfight enthusiast',
      location: 'New Babbage, microTech',
      rsi_handle: 'AcePilotBob',
      rsi_geid: 'GEID_Bob_67890',
      role: 'user',
      xp: 3200,
      isPremium: true,
      created_at: new Date('2024-01-04'),
      updated_at: new Date('2024-01-04')
    },
    {
      id: 5,
      handle: 'miner_charlie',
      displayName: 'Charlie Rockbreaker',
      email: 'charlie@example.com',
      passwordHash,
      bio: 'Deep space miner with a passion for rare minerals',
      location: 'Lorville, Hurston',
      rsi_handle: 'CharlieRockbreaker',
      role: 'user',
      xp: 1800,
      isPremium: false,
      created_at: new Date('2024-01-05'),
      updated_at: new Date('2024-01-05')
    },
    {
      id: 6,
      handle: 'explorer_diana',
      displayName: 'Diana Voidseeker',
      email: 'diana@example.com',
      passwordHash,
      bio: 'Explorer of unknown systems and jump points',
      location: 'Area18, ArcCorp',
      rsi_handle: 'DianaVoidseeker',
      rsi_geid: 'GEID_Diana_11111',
      role: 'user',
      xp: 4100,
      isPremium: true,
      created_at: new Date('2024-01-06'),
      updated_at: new Date('2024-01-06')
    }
  ];

  await knex('users').insert(users);
};