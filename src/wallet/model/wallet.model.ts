import { Column, columnTypes, Table } from 'nestjs-objection/dist';
import { Model } from 'objection';

@Table({ tableName: 'wallet' })
export class Wallet extends Model {
  @Column({ type: columnTypes.increments })
  id: number;

  @Column({ type: columnTypes.float })
  balance: number;

  @Column({ type: columnTypes.integer })
  users_id: number;

  @Column({ type: columnTypes.timestamp })
  created_at: string;

  @Column({ type: columnTypes.timestamp })
  updated_at: string;

  static creditWallet(id, amount) {
    console.log('credit wallet', id, amount);
    const resp = this.query()
      .where({ users_id: id })
      .patch({ balance: this.raw(`?? + ? `, ['balance', amount]) });
    return resp;
  }

  static debitWallet(id: number, amount: number) {
    console.log('debit wallet', id, amount);
    const resp = this.query()
      .where({ users_id: id })
      .patch({ balance: this.raw(`?? - ? `, ['balance', amount]) });
    return resp;
  }
}
