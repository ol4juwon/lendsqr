import { Test, TestingModule } from '@nestjs/testing';
import { ObjectionModule } from 'nestjs-objection/dist';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transactions } from './model/transactions.model';
import { TransactionsService } from './transactions.service';
import { Knex } from 'knex';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ObjectionModule.forRoot({
          config: {
            client: 'mysql',
            connection: {
              host: '127.0.0.1',
              user: 'ola',
              password: 'concheradmin',
              database: 'lendsqr',
            },
          },
        }),
        ObjectionModule.forFeature([Transactions]),
      ],
      providers: [
        TransactionsService,
        {
          provide: Transactions,
          useValue: {
            insert: jest.fn(),
            findOne: jest.fn().mockReturnValue({}),
          },
        },
      ],
    }).compile();

    service = await module.get<TransactionsService>(TransactionsService);
    // Model.knex(module.get('KnexProvider').knex);
    // knex = module.get('KnexClient');
  });

  describe('create', () => {
    it('attempt to create trabsaction with valid data', async () => {
      expect.assertions(2);
      const transaction = new CreateTransactionDto();
      transaction.amount = 2000.23;
      transaction.channel = 'card';
      transaction.description = 'Test desc';
      transaction.gateway = 'paystack';
      transaction.mode = 'card';
      transaction.status = 'pending';
      transaction.transactionId = 'ldsqr-233323';
      transaction.transactionType = 'credit';
      transaction.users_id = 1;
      const transactionSpy = jest.spyOn(service, 'create');
      const result = await service.create(transaction);
      console.log(result);
      expect(result.data.id).toBeDefined();
      expect(transactionSpy).toBeCalled();
    });
  });
  describe('find one', () => {
    it('find one with valid id', async () => {
      expect.assertions(2);
      const transactionSpy = jest.spyOn(service, 'findOne');
      const result = await service.findOne('ldsqr-233323');
      console.log(result);
      expect(result.data).toBeDefined();
      expect(transactionSpy).toBeCalled();
    });
    it('find one with invalid id', async () => {
      expect.assertions(2);
      const transactionSpy = jest.spyOn(service, 'findOne');
      const result = await service.findOne('dddd');
      console.log('failed', result);
      expect(result.error).toBeDefined();
      expect(transactionSpy).toBeCalled();
    });
  });
});
