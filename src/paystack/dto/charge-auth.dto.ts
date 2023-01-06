import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class ChargeAuthDto {
  @IsNotEmpty()
  @IsString()
  reference: string;

  @IsNotEmpty()
  @IsString()
  card_auth: string;

  @IsNotEmpty()
  @IsPositive()
  amount: number;

  @IsNotEmpty()
  @IsString()
  email: string;
}
