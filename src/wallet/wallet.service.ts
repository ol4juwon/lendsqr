import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
@Injectable()
export class WalletService {
  constructor(@InjectConnection() private readonly knex: Knex) {}
  async create(createWalletDto: CreateWalletDto) {
    const walletExist = await this.knex('wallet').where({
      users_id: createWalletDto.user_id,
    });
    if (walletExist[0]) {
      return { error: 'Wallet already exists for user' };
    }
    const response = await this.knex('wallet').insert({
      users_id: createWalletDto.user_id,
    });
    return { data: response[0] };
  }

  findAll() {
    return `This action returns all wallet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
