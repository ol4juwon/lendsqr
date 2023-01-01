/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('cards', function (table) {
    table.increments('id', { primaryKey: true });
    table.string('gateway', 255).notNullable();
    table.string('cardAuth', 255).unique().notNullable();
    table.string('bank', 255).notNullable();
    table.string('last4', 4).notNullable();
    table.string('cardType', 255).notNullable();
    table.json('customer', 255).notNullable();
    table.string('email', 255).notNullable();
    table.string('auth', 255).notNullable();
    table
      .integer('users_id')
      .unsigned()
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
