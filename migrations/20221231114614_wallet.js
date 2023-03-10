/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('wallet', function (table) {
    table.increments('id', { primaryKey: true });
    table.float('balance', 14, 2).defaultTo(0.0).notNullable();
    table
      .integer('users_id')
      .unsigned()
      .unique()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
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
  return knex.schema.dropTable('wallet');
};
