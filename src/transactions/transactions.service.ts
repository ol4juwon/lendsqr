import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { InjectModel } from 'nestjs-objection/dist';
import { Transactions } from './model/transactions.model';

@Injectable()
export class TransactionsService {
  constructor(@InjectModel(Transactions) private readonly transationsModel) {}
  async create(createTransactionDto: CreateTransactionDto) {
    try {
      // const response = await this.knex('transactions').insert(
      //   createTransactionDto,
      // );
      const response = await this.transationsModel
        .query()
        .insert(createTransactionDto);
      console.log(response);
      return { data: response[0] };
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    try {
      console.log('updating tranx', id, updateTransactionDto);
      delete updateTransactionDto?.donotalter;
      updateTransactionDto.users_id = +updateTransactionDto.users_id;
      const resp = await this.transationsModel
        .query()
        .patch(updateTransactionDto)
        .where({ transactionId: id });
      console.log('updating tranx', resp);
      return { data: resp };
    } catch (error) {
      console.log('error updating tranx', error);
      return { error };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
