/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
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
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable('likes');
};