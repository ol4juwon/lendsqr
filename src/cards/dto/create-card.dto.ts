import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  gateway: string;

  @IsNotEmpty()
  @IsString()
  cardAuth: string;

  @IsNotEmpty()
  @IsString()
  bank: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsEmail()
  auth: string;

  @IsNotEmpty()
  @IsString()
  last4: string;

  @IsNotEmpty()
  @IsString()
  cardType: string;

  @IsNotEmpty()
  @IsString()
  customer: string;
}
