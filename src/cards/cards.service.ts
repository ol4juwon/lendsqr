import { Injectable } from '@nestjs/common';
import { InjectModel, synchronize } from 'nestjs-objection/dist';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardModel } from './model/cards.model';

@Injectable()
export class CardsService {
  constructor(@InjectModel(CardModel) private readonly cardModel) {}
  async create(createCardDto: CreateCardDto) {
    try {
      await synchronize(CardModel);
      const x = await this.cardModel.query().insert(createCardDto);
      console.log('adding card', x);
      return { data: x };
    } catch (e) {
      console.log('errir card', Object.keys(e), e?.nativeError?.code);

      return { error: e?.nativeError.sqlMessage || e.message };
    }
  }

  findAll() {
    return `This action returns all cards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} card`;
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card`;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}
