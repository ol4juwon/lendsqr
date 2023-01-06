/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('cards', function (table) {
    table.increments('id', { primaryKey: true });
    table.string('gateway', 14).notNullable();
    table.string('cardAuth', 18).unique().notNullable();
    table.string('bank', 255).notNullable();
    table.string('last4', 4).notNullable();
    table.string('cardType', 20).notNullable();
    table.text('customer', 255).notNullable();
    table.string('email', 50).notNullable();
    table.string('brand', 20).notNullable();
    table.string('signature', 28).notNullable();
    table.string('exp', 7).notNullable();
    table.boolean('reusable').notNullable();
    table.string('country_code', 4).notNullable();
    table.string('channel', 20).notNullable();
    table.string('bin', 10).notNullable();
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
  return knex.schema.dropTable('cards');
};
