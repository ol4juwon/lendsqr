import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { AuthGuard } from '@nestjs/passport';
import { PaystackService } from 'src/paystack/paystack.service';
import { InitChargeDto } from 'src/paystack/dto/init-charge.dto';
import { ValidateBankDto } from './dto/validate-bank.dto';
import { CreateRecpientDto } from 'src/paystack/dto/create-recipient.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferUserDTO } from './dto/transfer-user.dto';
@UseGuards(AuthGuard('jwt'))
@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private paystackService: PaystackService,
  ) {}

  @Post()
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletService.create(createWalletDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.walletService.getUserWallet(+id);
  }
  @Post('/fund/card/init')
  async InitCardCharge(
    @Response() res: any,
    @Request() req: any,
    @Body() initChargeDto: InitChargeDto,
  ) {
    try {
      const { error, data } = await this.walletService.chargeCard(
        initChargeDto,
        req.user,
      );
      if (error) {
        return res.status(400).send({ error });
      }
      return res.status(200).send({ data });
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  @Post('/withdraw/validate/bank')
  async validateBank(
    @Response() res,
    @Body() validateBankDto: ValidateBankDto,
  ) {
    try {
      const { error, data } = await this.walletService.verifyBank(
        validateBankDto,
      );
      if (error) return res.status(400).send({ error });
      return res.status(200).send({ data });
    } catch (error) {
      return res.status(500).send({ error });
    }
  }

  @Post('/withdraw/addBank')
  async addBank(
    @Response() res: any,
    @Body() createRecipient: CreateRecpientDto,
    @Request() req: any,
  ) {
    const { error, data } = await this.walletService.addRecipient(
      createRecipient,
      req.user.sub,
    );
    if (error) return res.status(400).send({ error });

    return res.status(201).send({ data });
  }

  @Post('withdraw')
  async withdraw(
    @Response() res: any,
    @Body() withdrawDto: WithdrawDto,
    @Request() user: any,
  ) {
    const { error, data } = await this.walletService.withdraw(
      withdrawDto,
      user.user,
    );
    if (error) return res.status(400).send({ error });

    return res.status(200).send({ data });
  }

  @Post('withdraw/final')
  async finalizeWithdraw(
    @Response() res: any,
    @Body() withdrawOtp: any,
    @Request() user: any,
  ) {
    const { error, data } = await this.walletService.withdrawFinal(
      withdrawOtp,
      user.user,
    );
    if (error) return res.status(400).send({ error });

    return res.status(200).send({ data });
  }
  @Post('transfer/user')
  async transfer(
    @Response() res: any,
    @Body() transferDto: TransferUserDTO,
    @Request() user: any,
  ) {
    try {
      const { error, data } = await this.walletService.transferToUser(
        transferDto,
        user.user,
      );
      if (error) return res.status(400).send({ error });

      return res.status(200).send({ data });
    } catch (error) {
      console.log('eee');
      return res.status(500).send({ error });
    }
  }
}
