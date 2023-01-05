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
import { UsersService } from 'src/users/users.service';
import { InjectModel, synchronize } from 'nestjs-objection/dist';
import { Wallet } from './model/wallet.model';
import Objection from 'objection';
@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet) private readonly walletModel,
    private paystackService: PaystackService,
    private userService: UsersService,
  ) {}
  async create(createWalletDto: CreateWalletDto) {
    const walletExist = await this.walletModel.query().where({
      users_id: createWalletDto.user_id,
    });
    if (walletExist[0]) {
      return { error: 'Wallet already exists for user' };
    }
    const response = await this.walletModel.insert({
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
    try {
      const response = (
        await this.walletModel.query().where({ users_id: id }).limit(1)
      )[0];

      console.log(response);
      if (response) {
        response.wallet_id = response.id;
        delete response.id;
        return { data: response };
      }
      return { error: 'wallet not found' };
    } catch (e) {
      return { error: e };
    }
  }
  async getAllWallet({
    page = 1,
    limit = 10,
    orderBy = 'balance',
    order = 'ASC',
  }) {
    // let lenght ;
    try {
      const response = await this.walletModel
        .query()
        .select()
        .offset((page - 1) * limit)
        .limit(limit)
        .orderBy(orderBy, order);
      return {
        data: {
          result: response,
          page,
          limit,
          total: response.length,
        },
      };
    } catch (error) {
      return { error };
    }
  }
  /**
   *
   * @param initChargeDto
   * @returns error | data
   */
  async initCharge(initChargeDto: InitChargeDto, user: any) {
    const { error, data } = await this.paystackService.initCharge(
      initChargeDto,
      user,
    );
    if (error) return { error: error };

    return { data: data };
  }

  @OnEvent('payment.verify.success')
  async paymentSuccessFul(msg: any) {
    console.log('Message Received: ', msg.metadata, msg.metadata.donotalter);
    if (!msg.metadata.donotalter) {
      console.log('do not change account');
      return { data: 'ok' };
    }
    const x = await this.fundWallet(msg.amount / 100, msg.metadata.users_id);
    console.log('donot change', x);
  }

  private async fundWallet(amount: number, user_id: any) {
    const response = await this.walletModel.creditWallet(+user_id, amount);
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

  async withdraw(withdrawdto: WithdrawDto, user: any) {
    await synchronize(Wallet);
    const payload = { ...withdrawdto, source: 'balance', user };
    const bal = await this.walletModel
      .query()
      .select('balance')
      .where({ users_id: user.sub });
    console.log('balann', bal[0]);
    if (bal[0].balance < withdrawdto.amount)
      return { error: 'Amount is higher than your balance' };
    const { error, data } = await this.paystackService.withdrawal(payload);
    if (error) return { error };
    return { data };
  }
  async withdrawFinal(withdrawdto: any, user: any) {
    const trfResp = await this.paystackService.transferDetails(
      withdrawdto.transfer_code,
    );
    const bal = await this.walletModel
      .query()
      .select('balance')
      .where({ users_id: user.sub });
    console.log('balann', bal[0], trfResp.data.data);
    if (bal[0].balance < trfResp.data.data.amount)
      return { error: 'Amount is higher than your balance' };

    const { error, data } = await this.paystackService.withdrawalFinal(
      withdrawdto,
    );
    if (error) return { error };
    return { data };
  }

  async transferToUser(payload: any, user: any) {
    try {
      const response = await this.userService.getIdByUsername(payload.username);
      if (response.error) return { error: 'Recepient not found' };
      const recepientID = response.data;
      const vwallet = (
        await this.walletModel.query().where({ users_id: user.sub }).limit(1)
      )[0];
      console.log('Waallet', payload, vwallet);
      if (Math.abs(payload.amount) > vwallet.balance)
        return { error: 'Insufficient Balance' };
      const debit = await this.walletModel.debitWallet(
        user.sub,
        payload.amount,
      );

      console.log('logg', debit);
      const send = await this.walletModel.creditWallet(
        recepientID,
        payload.amount,
      );
      console.log('longg', send);

      // const trxResponse = await this.knex.transaction(async (trx) => {
      //   // subtract from sender then add to recipient
      //   return this.knex('wallet')
      //     .transacting(trx)
      //     .update({
      //       balance: this.knex.raw(`?? - ${payload.amount}`, ['balance']),
      //     })
      //     .where({ users_id: user.sub })
      //     .then(async () => {
      //       return this.knex('wallet')
      //         .update({
      //           balance: this.knex.raw(`?? + ${payload.amount}`, ['balance']),
      //         })
      //         .where({ users_id: recepientID })
      //         .then(trx.commit)
      //         .catch((e) => {
      //           trx.rollback();
      //           throw e;
      //         });
      //     })
      //     .then(() => {
      //       return { data: 'success' };
      //     })
      //     .catch((e) => {
      //       return { error: e };
      //     });
      // });
      return { data: 'transfer successfull' };
    } catch (error) {
      console.log('efrror', error);
      return { error };
    }
  }
}
