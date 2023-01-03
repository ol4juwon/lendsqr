import { IsDecimal, IsNotEmpty, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsDecimal()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  gateway: string;

  @IsString()
  @IsNotEmpty()
  channel: string;

  @IsNotEmpty()
  users_id: number;

  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  mode: string;

  @IsNotEmpty()
  @IsString()
  transactionType: string;
}
