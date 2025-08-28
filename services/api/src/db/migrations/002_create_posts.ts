import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('posts', (table) => {
    table.increments('id').primary();
    table.integer('userId').unsigned().notNullable();
    table.text('content').notNullable();
    table.json('mediaUrls'); // Array of media URLs
    table.integer('likesCount').defaultTo(0);
    
    // Moderation
    table.boolean('isModerated').defaultTo(false);
    table.timestamp('moderatedAt');
    table.integer('moderatedBy').unsigned();
    table.text('moderationReason');
    
    // Timestamps
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('moderatedBy').references('id').inTable('users');
    
    // Indexes
    table.index('userId');
    table.index('createdAt'); // For chronological feeds
    table.index('isModerated');
    table.index('likesCount'); // For popular posts
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('posts');
}