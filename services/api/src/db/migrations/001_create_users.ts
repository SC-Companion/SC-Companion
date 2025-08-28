import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    
    // SC Companion internal data
    table.string('handle', 30).notNullable().unique();
    table.string('displayName', 100).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('passwordHash', 255).notNullable();
    table.text('bio');
    table.string('location', 100);
    table.text('avatar'); // URL to avatar image
    
    // RSI data
    table.string('rsi_handle', 50);
    table.string('rsi_geid', 100); // RSI Game Entity ID from logs
    
    // Role system
    table.enum('role', ['user', 'moderator', 'admin', 'super_admin']).defaultTo('user');
    
    // Account status
    table.boolean('isActive').defaultTo(true);
    table.boolean('isBanned').defaultTo(false);
    table.timestamp('bannedAt');
    table.text('bannedReason');
    table.integer('bannedBy').unsigned();
    
    // Premium system
    table.boolean('isPremium').defaultTo(false);
    table.timestamp('premiumExpiresAt');
    
    // XP progression (level is calculated from XP)
    table.integer('xp').defaultTo(0);
    
    // Timestamps
    table.timestamps(true, true);
    
    // Indexes
    table.index('handle');
    table.index('email');
    table.index('rsi_handle');
    table.index('rsi_geid');
    table.index('role');
    table.index('isActive');
    table.index('xp'); // For leaderboards
    
    // Foreign keys
    table.foreign('bannedBy').references('id').inTable('users');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}