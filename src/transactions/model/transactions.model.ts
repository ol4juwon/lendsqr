import { Column, columnTypes, Table } from 'nestjs-objection/dist';
import { Model } from 'objection';

@Table({ tableName: 'transactions' })
export class Transactions extends Model {
  @Column({ type: columnTypes.string })
  id: string;

  @Column({ type: columnTypes.integer })
  users_id: number;

  @Column({ type: columnTypes.string })
  gateway: string;

  @Column({ type: columnTypes.string })
  mode: string;
  @Column({ type: columnTypes.string })
  transactionId: string;

  @Column({ type: columnTypes.string })
  status: string;

  @Column({ type: columnTypes.string })
  transactionType: string;

  @Column({ type: columnTypes.string })
  channel: string;

  @Column({ type: columnTypes.float })
  amount: number;

  @Column({ type: columnTypes.timestamp })
  created_at: string;

  @Column({ type: columnTypes.timestamp })
  updated_at: string;
}
