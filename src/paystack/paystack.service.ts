import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InitChargeDto } from './dto/init-charge.dto';
import { ChargeAuthDto } from './dto/charge-auth.dto';
import { lastValueFrom, map } from 'rxjs';
import { nanoid } from 'nanoid/async';
import { TransactionsService } from 'src/transactions/transactions.service';
import { CardsService } from 'src/cards/cards.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ValidateBankDto } from 'src/wallet/dto/validate-bank.dto';
import { CreateRecpientDto } from './dto/create-recipient.dto';
@Injectable()
export class PaystackService {
  private readonly logger = new Logger(PaystackService.name);
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private transactionService: TransactionsService,
    private cardService: CardsService,
    private emitter: EventEmitter2,
  ) {}
  async initCharge(initChargeDto: InitChargeDto, user: any) {
    // /transaction/initialize
    try {
      const url = `${this.configService.get(
        'PAYSTACK_BASE_URL',
      )}/transaction/initialize`;
      initChargeDto.amount = initChargeDto.amount * 100;
      const ref = await this.genRef();
      initChargeDto.reference = ref.data;
      // const data: any = initChargeDto;
      const transaction: any = {
        transactionId: initChargeDto.reference,
        users_id: user.sub,
        amount: initChargeDto.amount / 100,
        description: 'Collection for a pending transaction',
        mode: 'CARD',
        channel: 'CARD',
        transactionType: 'PAYMENT',
        status: 'pending',
        gateway: 'PAYSTACK',
      };
      // transaction.metadata = initChargeDto;
      const trx = await this.transactionService.create(transaction);
      if (trx.error) {
        return { error: 'Error completing Transaction' };
      }
      initChargeDto.metadata = transaction;
      const response = await this.request(url, 'Post', initChargeDto);

      if (response.data?.status) {
        return { data: response };
      }
      console.log('55', response.error);
      return {
        error: { error: response.error, status: response.error.status },
      };
    } catch (error) {
      console.log('60: error', error);
      return { error: error.message || error };
    }
  }

  async chargeAuth(chargeAuthDto: ChargeAuthDto) {
    try {
      // /transaction/charge_authorization
      // eference: transactionId,
      //             authorization_code: chargeAuth,
      //             amount: amount * 100,
      //             currency: "NGN",
      //             email: email.trim().toString()
      const url = `${this.configService.get(
        'PAYSTACK_BASE_URL',
      )}/transaction/charge_authorization`;
      const data = JSON.stringify(chargeAuthDto);
      const response = await lastValueFrom(
        this.httpService
          .post(url, data, {
            adapter: 'http',
            headers: {
              'Content-Type': 'application/json',
              accept: 'application/json',
              'cache-control': 'no-cache',
              Authorization: `Bearer ${process.env.PAYSTACK_PRIVATE}`,
            },
          })
          .pipe(
            map((res) => {
              return res.data;
            }),
          )
          .pipe(),
      );
      return { data: response };
    } catch (error) {
      console.log(error.response);
      return { error: error.response.data };
    }
  }

  async verify(trx: string, dnab?: boolean) {
    try {
      const url = `${this.configService.get(
        'PAYSTACK_BASE_URL',
      )}/transaction/verify/${trx}`;
      this.logger.debug('verifying');
      const { data, error } = await this.request(url, 'GET');
      // this.logger.debug('112', data, error);
      if (error) {
        data.metadata.status = 'failed';
        data.metadata.error = error;
        this.emitter.emit('payment.verify.failed', data);
        return { error: error };
      }
      delete data.log;
      if (data.status) {
        //TODO: emit transaction success event
        data.data.metadata.donotalter = dnab ? dnab : false;
        data.data.metadata.status = 'successful';
        // this.logger.verbose('datum', data.data);
        this.emitter.emit('payment.verify.success', data.data);
        const { authorization } = data.data;
        const { customer } = data.data;
        const card = {
          last4: authorization.last4,
          bank: authorization.bank,
          gateway: 'paystack',
          bin: authorization.bin,
          users_id: +data.data.metadata.users_id,
          channel: authorization.channel,
          exp: `${authorization.exp_month}/${authorization.exp_year}`,
          cardAuth: authorization.authorization_code,
          email: customer.email,
          auth: authorization.auth,
          customer: JSON.stringify(customer),
          cardType: authorization.card_type,
          reusable: authorization.reusable,
          signature: authorization.signature,
          brand: authorization.brand,
          country_code: authorization.country_code,
        };
        console.log('card', card);
        const cardResponse = await this.cardService.create(card);
        this.logger.debug(cardResponse);
      }
      const {
        id,
        status,
        amount,
        channel,
        authorization,
        customer,
        metadata,
        transaction_date,
        paid_at,
        created_at,
      } = data;
      await this.transactionService.update(
        data.data.metadata.transactionId,
        data.data.metadata,
      );
      const payload = {
        id,
        status,
        amount,
        channel,
        authorization,
        customer,
        metadata,
        transaction_date,
        paid_at,
        created_at,
      };
      return { data: payload };
    } catch (error) {
      return { error: error.message || error.details || error };
    }
  }

  async addBank() {
    // `/transferrecipient`
    // type: BANKTYPE.NUBAN,
    // name: request.bankName,
    // description:"PMB Add Bank",
    // currency: "NGN",
    // bank_code:request.bankCode,
    // account_number: request.accountNumber,
  }

  async genRef() {
    const nano = await nanoid();
    const ref = `lendsqr-${nano}`;
    return { data: ref };
  }
  async getBankCodes(): Promise<any> {
    const url = `${this.configService.get('PAYSTACK_BASE_URL')}/bank`;
    const { data, error } = await lastValueFrom(
      this.httpService
        .get(url, {
          adapter: 'http',
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
            'cache-control': 'no-cache',
            Authorization: `Bearer ${process.env.PAYSTACK_PRIVATE}`,
          },
        })
        .pipe(
          map((res) => {
            return res.data;
          }),
        )
        .pipe(),
    );
    if (error) return { error };
    const banks = [];
    data.map((items) => {
      const x = { name: items.name, code: items.code, slug: items.slug };
      banks.push(x);
    });
    return { data: banks };
  }
  async verifyAccountNumber(account: ValidateBankDto) {
    try {
      const { account_number, bank_code } = account;
      const url = `${this.configService.get(
        'PAYSTACK_BASE_URL',
      )}/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`;
      const response = await this.request(url, 'GET');
      if (response.error) return { error: response.error };
      const account_name = response.data.data.account_name;

      return { data: { account_number, bank_code, account_name } };
    } catch (error) {
      console.log('error', error);
      return { error: error };
    }
  }
  async createRecipient(createRecipient: CreateRecpientDto) {
    const url = `${this.configService.get(
      'PAYSTACK_BASE_URL',
    )}/transferrecipient`;
    const { error, data } = await this.request(url, 'Post', createRecipient);
    if (error) return { error };

    return { data };
  }

  async transferDetails(id: string) {
    try {
      const url = `${this.configService.get(
        'PAYSTACK_BASE_URL',
      )}/transfer/${id}`;
      const { error, data } = await this.request(url, 'GET');
      if (error) return { error };
      return { data };
    } catch (error) {
      return { error: error };
    }
  }
  async withdrawal({ source, reason, amount, recipient, user }: any) {
    try {
      const payload: any = { source, reason, amount, recipient };
      const url = `${this.configService.get('PAYSTACK_BASE_URL')}/transfer`;
      const ref = await this.genRef();
      const transaction: any = {
        transactionId: ref.data,
        users_id: user.sub,
        amount: amount / 100,
        description: 'Wallet withdrawal',
        mode: 'Bank',
        channel: 'Transfer',
        transactionType: 'PAYMENT',
        status: 'pending',
        gateway: 'PAYSTACK',
      };
      const trx = await this.transactionService.create(transaction);
      if (trx[0]) return { error: 'failed to complete' };
      payload.metadata = transaction;
      const { error, data } = await this.request(url, 'Post', payload);
      if (error) return { error };
      return { data };
    } catch (error) {
      return { error };
    }
  }
  async withdrawalFinal({ transfer_code, otp }: any) {
    try {
      const payload = { transfer_code, otp };
      const url = `${this.configService.get(
        'PAYSTACK_BASE_URL',
      )}/transfer/finalize_transfer`;
      const { error, data } = await this.request(url, 'Post', payload);
      if (error) return { error };
      return { data };
    } catch (error) {
      return { error };
    }
  }

  async request(url: string, method?: string, payload?: any) {
    try {
      const response = await axios({
        url,
        method: method || 'GET',
        data: payload,
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          'cache-control': 'no-cache',
          Authorization: `Bearer ${process.env.PAYSTACK_PRIVATE}`,
        },
      });
      if (response?.data) return { data: response?.data };

      return { error: response };
    } catch (error) {
      console.log('285', error?.response.data);
      return {
        error: {
          error: error?.response?.data || error.code,
          status: error?.response?.status,
          errorMessage: error?.response?.statusText,
        },
      };
    }
  }
}
