import { Module } from '@nestjs/common';
import { PaystackService } from './paystack.service';
import { PaystackController } from './paystack.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Axios } from 'axios';
import { TransactionsService } from 'src/transactions/transactions.service';
import { CardsService } from 'src/cards/cards.service';

@Module({
  controllers: [PaystackController],
  providers: [
    PaystackService,
    ConfigService,
    Axios,
    TransactionsService,
    CardsService,
  ],
  imports: [HttpModule],
})
export class PaystackModule {}
