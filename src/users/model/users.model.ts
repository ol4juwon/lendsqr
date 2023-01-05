import {
  Model,
  Column,
  Relation,
  Table,
  relationTypes,
  columnTypes,
} from 'nestjs-objection';
import { BanKModel } from 'src/banks/model/banks.model';
import { Transactions } from 'src/transactions/model/transactions.model';
import { Wallet } from 'src/wallet/model/wallet.model';

@Table({ tableName: 'users' })
export class Users extends Model {
  @Column({ type: columnTypes.increments })
  id: number;

  @Column({ type: columnTypes.string })
  username: string;

  @Column({ type: columnTypes.string })
  firstName: string;

  @Column({ type: columnTypes.string })
  lastName: string;

  @Column({ type: columnTypes.string })
  password: string;

  @Column({ type: columnTypes.string })
  roles: string[];

  @Column({ type: columnTypes.string })
  email: string;

  @Column({ type: columnTypes.timestamp })
  created_at: string;

  @Column({ type: columnTypes.timestamp })
  updated_at: string;

  @Relation({
    modelClass: Transactions,
    relation: relationTypes.HasManyRelation,
    join: { from: 'users.id', to: 'transactions.users_id' },
  })
  transactions: Transactions[];

  @Relation({
    modelClass: BanKModel,
    relation: relationTypes.HasManyRelation,
    join: { from: 'users.id', to: 'banks.users_id' },
  })
  banks: BanKModel[];
  @Relation({
    modelClass: Wallet,
    relation: relationTypes.HasOneRelation,
    join: { from: 'users.id', to: 'wallet.users_id' },
  })
  wallet: Wallet;

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}
