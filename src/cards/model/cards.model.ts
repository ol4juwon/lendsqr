import { Column, columnTypes, Model, Table } from 'nestjs-objection/dist';

@Table({ tableName: 'cards' })
export class CardModel extends Model {
  @Column({ type: columnTypes.increments })
  private readonly id: number;

  @Column({ type: columnTypes.string })
  last4: string;

  @Column({ type: columnTypes.string, unique: true })
  cardAuth: string;

  @Column({ type: columnTypes.string })
  gateway: string;

  @Column({ type: columnTypes.string })
  bank: string;

  @Column({ type: columnTypes.string })
  cardType: string;

  @Column({ type: columnTypes.string })
  customer: string;

  @Column({ type: columnTypes.number })
  users_id: number;

  @Column({ type: columnTypes.string })
  email: string;

  @Column({ type: columnTypes.string })
  bin: string;

  @Column({ type: columnTypes.string })
  brand: string;

  @Column({ type: columnTypes.string })
  exp: string;

  @Column({ type: columnTypes.string })
  channel: string;

  @Column({ type: columnTypes.string })
  signature: string;

  @Column({ type: columnTypes.string })
  country_code: string;

  @Column({ type: columnTypes.boolean })
  reusable: boolean;

  @Column({ type: columnTypes.timestamp })
  readonly created_at: string;

  @Column({ type: columnTypes.timestamp })
  updated_at: string;
}
