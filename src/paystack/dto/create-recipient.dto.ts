import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { ValidateBankDto } from 'src/wallet/dto/validate-bank.dto';

export class CreateRecpientDto extends ValidateBankDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
