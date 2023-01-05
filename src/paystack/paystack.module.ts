import { Module } from '@nestjs/common';
import { PaystackService } from './paystack.service';
import { PaystackController } from './paystack.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Axios } from 'axios';
import { TransactionsService } from 'src/transactions/transactions.service';
import { CardsService } from 'src/cards/cards.service';
import { ObjectionModule } from 'nestjs-objection/dist';
import { Transactions } from 'src/transactions/model/transactions.model';
import { CardModel } from 'src/cards/model/cards.model';

@Module({
  controllers: [PaystackController],
  providers: [
    PaystackService,
    ConfigService,
    Axios,
    TransactionsService,
    CardsService,
  ],
  imports: [HttpModule, ObjectionModule.forFeature([Transactions, CardModel])],
})
export class PaystackModule {}
