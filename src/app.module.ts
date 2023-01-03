import { Module } from '@nestjs/common';
import { KnexModule } from 'nest-knexjs';
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
@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    KnexModule.forRoot({
      config: {
        client: 'mysql2',
        version: '8.0',
        useNullAsDefault: true,
        connection: {
          host: '127.0.0.1',
          user: 'ola',
          password: 'concheradmin',
          database: 'lendsqr',
        },
      },
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
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, ConfigService, UsersService, JwtService],
})
export class AppModule {}
