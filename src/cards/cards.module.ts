import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { ObjectionModule } from 'nestjs-objection/dist';
import { CardModel } from './model/cards.model';

@Module({
  controllers: [CardsController],
  providers: [CardsService],
  imports: [ObjectionModule.forFeature([CardModel])],
})
export class CardsModule {}
