import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { InitChargeDto } from 'src/paystack/dto/init-charge.dto';
import { PaystackService } from 'src/paystack/paystack.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ValidateBankDto } from './dto/validate-bank.dto';
import { CreateRecpientDto } from 'src/paystack/dto/create-recipient.dto';
import { WithdrawDto } from './dto/withdraw.dto';
@Injectable()
export class WalletService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private paystackService: PaystackService,
  ) {}
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

  /**
   *
   * @param id
   * @returns wallet object | Error
   */
  async getUserWallet(id: number) {
    const response = (
      await this.knex('wallet').where({ users_id: id }).limit(1)
    )[0];
    response.wallet_id = response.id;
    delete response.id;
    if (response) return { data: response };
    return { error: 'wallet not found' };
  }

  /**
   *
   * @param initChargeDto
   * @returns error | data
   */
  async chargeCard(initChargeDto: InitChargeDto, user: any) {
    const { error, data } = await this.paystackService.initCharge(
      initChargeDto,
      user,
    );
    if (error) return { error: error };

    return { data: data };
  }

  @OnEvent('payment.success')
  async paymentSuccessFul(msg: any) {
    console.log('Message Received: ', msg);
    if (!msg.donotalter) return console.log('do not change account');
    const x = await this.fundWallet(msg.amount / 100, msg.users_id);
    console.log('donot change', x);
  }

  private async fundWallet(amount: number, user_id: any) {
    const response = await this.knex('wallet')
      .update({ balance: this.knex.raw(`?? + ${amount}`, ['balance']) })
      .where({ users_id: user_id });
    return response;
  }

  async verifyBank(payload: ValidateBankDto) {
    const { error, data } = await this.paystackService.verifyAccountNumber(
      payload,
    );
    if (error) return { error };
    return { data: data };
  }

  async addRecipient(createRecipient: CreateRecpientDto, id: number) {
    const { error, data } = await this.paystackService.createRecipient(
      createRecipient,
    );
    if (error) return { error };
    // add to bank transfer list;
    return { data };
  }

  async withdraw(withdrawdto: WithdrawDto) {
    const payload = { ...withdrawdto, source: 'balance' };
    const { error, data } = await this.paystackService.withdrawal(payload);
    if (error) return { error };
    return { data };
  }
  async withdrawFinal(withdrawdto: any) {
    const { error, data } = await this.paystackService.withdrawalFinal(
      withdrawdto,
    );
    if (error) return { error };
    return { data };
  }
}
