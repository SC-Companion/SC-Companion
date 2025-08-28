/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
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
    
    // Indexes
    table.index('followerId');
    table.index('followingId');
    table.index('createdAt');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable('follows');
};