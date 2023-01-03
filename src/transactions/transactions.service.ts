import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class TransactionsService {
  constructor(@InjectConnection() private knex: Knex) {}
  async create(createTransactionDto: CreateTransactionDto) {
    try {
      const response = await this.knex('transactions').insert(
        createTransactionDto,
      );
      return { data: response[0] };
    } catch (error) {
      return { error: error };
    }
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
