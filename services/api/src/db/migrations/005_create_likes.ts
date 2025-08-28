import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('likes', (table) => {
    table.increments('id').primary();
    table.integer('userId').unsigned().notNullable();
    table.integer('postId').unsigned().notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    
    // Foreign keys
    table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('postId').references('id').inTable('posts').onDelete('CASCADE');
    
    // Prevent duplicate likes
    table.unique(['userId', 'postId']);
    
    // Indexes
    table.index('userId');
    table.index('postId');
    table.index('createdAt');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('likes');
}