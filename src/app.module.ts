import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';
import { CardsModule } from './cards/cards.module';
import { PaystackModule } from './paystack/paystack.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransactionsModule } from './transactions/transactions.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ObjectionModule, Model } from 'nestjs-objection';
import { Users } from './users/model/users.model';
import { Wallet } from './wallet/model/wallet.model';
import { Transactions } from './transactions/model/transactions.model';
import { BanksService } from './banks/banks.service';
import { BanksModule } from './banks/banks.module';
@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    ObjectionModule.forRootAsync({
      useFactory: () => ({
        Model,
        config: {
          client: 'mysql',
          useNullAsDefault: true,
          connection: {
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASS,
            database: process.env.DATABASE_NAME,
          },
        },
      }),
    }),
    WalletModule,
    CardsModule,
    PaystackModule,
    AuthModule,
    TransactionsModule,
    EventEmitterModule.forRoot({
      wildcard: false,
      maxListeners: 10,
      ignoreErrors: false,
      delimiter: '.',
    }),
    ObjectionModule.forFeature([Users, Wallet, Transactions]),
    BanksModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    AuthService,
    ConfigService,
    UsersService,
    JwtService,
    BanksService,
  ],
})
export class AppModule {}
