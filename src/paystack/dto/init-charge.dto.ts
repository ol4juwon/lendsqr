import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InitChargeDto {
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  reference: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  metadata: any;
}
