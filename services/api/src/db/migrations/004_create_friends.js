/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('friends', (table) => {
    table.increments('id').primary();
    table.integer('requesterId').unsigned().notNullable();
    table.integer('addresseeId').unsigned().notNullable();
    table.enum('status', ['pending', 'accepted', 'declined']).defaultTo('pending');
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('requesterId').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('addresseeId').references('id').inTable('users').onDelete('CASCADE');
    
    // Prevent self-friend requests and duplicate requests
    table.unique(['requesterId', 'addresseeId']);
    
    // Indexes
    table.index('requesterId');
    table.index('addresseeId');
    table.index('status');
    table.index('createdAt');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable('friends');
};