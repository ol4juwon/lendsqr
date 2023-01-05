import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class ChargeAuthDto {
  @IsNotEmpty()
  @IsString()
  refernce: string;

  @IsNotEmpty()
  @IsString()
  authorization_code: string;

  @IsNotEmpty()
  @IsPositive()
  amount: number;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
