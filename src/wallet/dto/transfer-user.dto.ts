import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class TransferUserDTO {
  @IsNotEmpty()
  @IsPositive()
  amount: number;

  @IsNotEmpty()
  @IsString()
  username: string;
}
