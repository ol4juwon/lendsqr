import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class WithdrawDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  recipient: string;
}
