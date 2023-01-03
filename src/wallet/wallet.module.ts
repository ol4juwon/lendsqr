import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { PaystackService } from 'src/paystack/paystack.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TransactionsService } from 'src/transactions/transactions.service';
import { CardsService } from 'src/cards/cards.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [WalletController],
  providers: [
    WalletService,
    PaystackService,
    ConfigService,
    TransactionsService,
    CardsService,
    UsersService,
  ],
  imports: [HttpModule],
})
export class WalletModule {}
