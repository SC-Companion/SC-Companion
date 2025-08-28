import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('follows', (table) => {
    table.increments('id').primary();
    table.integer('followerId').unsigned().notNullable();
    table.integer('followingId').unsigned().notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    
    // Foreign keys
    table.foreign('followerId').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('followingId').references('id').inTable('users').onDelete('CASCADE');
    
    // Prevent self-follows and duplicate follows
    table.unique(['followerId', 'followingId']);
    table.check('followerId != followingId');
    
    // Indexes
    table.index('followerId');
    table.index('followingId');
    table.index('createdAt');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('follows');
}