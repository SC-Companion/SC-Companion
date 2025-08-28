const knex = require('knex');
const bcrypt = require('bcryptjs');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './dev.db'
  },
  useNullAsDefault: true
});

async function createDatabase() {
  console.log('🗃️  Creating database tables...');

  try {
    // Create users table
    await db.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('handle', 30).notNullable().unique();
      table.string('displayName', 100).notNullable();
      table.string('email', 255).notNullable().unique();
      table.string('passwordHash', 255).notNullable();
      table.text('bio');
      table.string('location', 100);
      table.text('avatar');
      table.string('rsi_handle', 50);
      table.string('rsi_geid', 100);
      table.string('role').defaultTo('user');
      table.boolean('isActive').defaultTo(true);
      table.boolean('isBanned').defaultTo(false);
      table.timestamp('bannedAt');
      table.text('bannedReason');
      table.integer('bannedBy').unsigned();
      table.boolean('isPremium').defaultTo(false);
      table.timestamp('premiumExpiresAt');
      table.integer('xp').defaultTo(0);
      table.timestamps(true, true);
    });
    console.log('✅ Users table created');

    // Create posts table
    await db.schema.createTable('posts', (table) => {
      table.increments('id').primary();
      table.integer('userId').unsigned().notNullable();
      table.text('content').notNullable();
      table.json('mediaUrls');
      table.integer('likesCount').defaultTo(0);
      table.boolean('isModerated').defaultTo(false);
      table.timestamp('moderatedAt');
      table.integer('moderatedBy').unsigned();
      table.text('moderationReason');
      table.timestamps(true, true);
      table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');
    });
    console.log('✅ Posts table created');

    // Create follows table
    await db.schema.createTable('follows', (table) => {
      table.increments('id').primary();
      table.integer('followerId').unsigned().notNullable();
      table.integer('followingId').unsigned().notNullable();
      table.timestamp('createdAt').defaultTo(db.fn.now());
      table.foreign('followerId').references('id').inTable('users').onDelete('CASCADE');
      table.foreign('followingId').references('id').inTable('users').onDelete('CASCADE');
      table.unique(['followerId', 'followingId']);
    });
    console.log('✅ Follows table created');

    // Create friends table
    await db.schema.createTable('friends', (table) => {
      table.increments('id').primary();
      table.integer('requesterId').unsigned().notNullable();
      table.integer('addresseeId').unsigned().notNullable();
      table.string('status').defaultTo('pending');
      table.timestamps(true, true);
      table.foreign('requesterId').references('id').inTable('users').onDelete('CASCADE');
      table.foreign('addresseeId').references('id').inTable('users').onDelete('CASCADE');
      table.unique(['requesterId', 'addresseeId']);
    });
    console.log('✅ Friends table created');

    // Create likes table
    await db.schema.createTable('likes', (table) => {
      table.increments('id').primary();
      table.integer('userId').unsigned().notNullable();
      table.integer('postId').unsigned().notNullable();
      table.timestamp('createdAt').defaultTo(db.fn.now());
      table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');
      table.foreign('postId').references('id').inTable('posts').onDelete('CASCADE');
      table.unique(['userId', 'postId']);
    });
    console.log('✅ Likes table created');

    console.log('🌱 Creating seed data...');
    
    const passwordHash = await bcrypt.hash('password123', 12);

    // Insert users
    await db('users').insert([
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
        isPremium: true
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
        isPremium: true
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
        isPremium: false
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
        isPremium: true
      }
    ]);
    console.log('✅ Sample users created');

    // Insert sample posts
    await db('posts').insert([
      {
        id: 1,
        userId: 3,
        content: 'Just completed my first cargo run from ArcCorp to Hurston! The views along the way were absolutely breathtaking. 🚀 #StarCitizen #Trading',
        likesCount: 15
      },
      {
        id: 2,
        userId: 4,
        content: 'Had an epic dogfight in my Gladius today! Three pirates vs me, and I managed to take them all down. Practice makes perfect! 💪',
        likesCount: 23
      }
    ]);
    console.log('✅ Sample posts created');

    // Insert sample follows
    await db('follows').insert([
      { followerId: 3, followingId: 4 },
      { followerId: 4, followingId: 3 },
      { followerId: 1, followingId: 3 },
      { followerId: 1, followingId: 4 },
      { followerId: 2, followingId: 3 },
      { followerId: 2, followingId: 4 }
    ]);
    console.log('✅ Sample follows created');

    console.log('🎉 Database setup complete!');
    console.log('\nTest accounts:');
    console.log('- admin@sc-companion.com (Super Admin) - password: password123');
    console.log('- moderator@sc-companion.com (Moderator) - password: password123');
    console.log('- alice@example.com (User) - password: password123');
    console.log('- bob@example.com (User Premium) - password: password123');

  } catch (error) {
    console.error('❌ Error creating database:', error);
  } finally {
    await db.destroy();
  }
}

createDatabase();