/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('transactions', function (table) {
    table
      .uuid('id', { primaryKey: true })
      .primary()
      .defaultTo(knex.raw(`UUID_TO_BIN(UUID(), true)`));
    table.float('amount', 14, 2).notNullable();
    table.string('transactionId').notNullable().unique();
    table.enu('status', ['pending', 'failed', 'successful']).notNullable();
    table.string('gateway', 18).notNullable();
    table.string('channel', 14).notNullable(); //card/wallet/ussd/transfer
    table.string('mode', 14).notNullable();
    table.string('transactionType', 14).notNullable(); //Deposit/withdrawal/refund
    table.string('description').notNullable().defaultTo('Fund charge');
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
