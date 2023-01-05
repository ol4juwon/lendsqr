import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { ObjectionModule } from 'nestjs-objection/dist';
import { Transactions } from './model/transactions.model';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [ObjectionModule.forFeature([Transactions])],
})
export class TransactionsModule {}
