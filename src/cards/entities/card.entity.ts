import * as Knex from 'knex';

export class Card {
  id: number;
  last4: string;
  cardAuth: string;
  gateway: string;
  bin: string;
  users_id: number;
  customer: any;
  email: string;
  auth: string;
  created_at: any;
  updated_at: any;
  cardType: string;

  static get tableName() {
    return 'cards';
  }

  static get idColumn() {
    return 'id';
  }
}
