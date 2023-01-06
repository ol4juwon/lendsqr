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
      console.log('ddd', response);
      return { data: response };
    } catch (error) {
      console.log(error);
      return {
        error:
          error?.nativeError.sqlMessage ||
          error.message ||
          error.details ||
          error,
      };
    }
  }

  findAll() {
    return `This action returns all transactions`;
  }

  async findOne(id: string) {
    try {
      const response = await this.transationsModel
        .query()
        .findOne({ transactionId: id });
      console.log('response', response);
      if (!response) return { error: 'Not found' };
      return { data: response };
    } catch (error) {
      return { error };
    }
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
