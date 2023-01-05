import { Column, columnTypes, Table } from 'nestjs-objection/dist';
import { Model } from 'objection';

@Table({ tableName: 'banks' })
export class BanKModel extends Model {
  @Column({ type: columnTypes.increments, primary: true })
  private readonly id: number;

  @Column({ type: columnTypes.string })
  bank_code: string;

  @Column({ type: columnTypes.string })
  account_number: string;

  @Column({ type: columnTypes.string })
  account_name: string;

  @Column({ type: columnTypes.string })
  users_id: string;

  @Column({ type: columnTypes.timestamp })
  created_at: string;

  @Column({ type: columnTypes.timestamp })
  updated_at: string;
}
