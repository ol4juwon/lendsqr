/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('transactions', function (table) {
    table
      .uuid('id', { primaryKey: true })
      .primary()
      .defaultTo(knex.raw('(UUID())'));
    table.float('amount', 14, 2).notNullable();
    table.enu('status', ['pending', 'failed', 'successful']).notNullable();
    table.string('gateway', 255).notNullable();
    table.string('channel', 255).notNullable();
    table
      .integer('users_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users');
    table
      .timestamp('created_at', { precision: 6, useTz: true })
      .defaultTo(knex.fn.now(6));
    table
      .timestamp('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('transactions');
};
