import { Controller, Get, Param, Query, Response } from '@nestjs/common';
import { PaystackService } from './paystack.service';
@Controller('paystack')
export class PaystackController {
  constructor(private readonly paystackService: PaystackService) {}
  @Get('/verify/:trx_id')
  async verifyPayment(
    @Response() res,
    @Param('trx_id') trx: string,
    @Query('dnab') dnab: boolean,
  ) {
    const { error, data } = await this.paystackService.verify(trx, dnab);
    if (error) return res.status(400).send({ error: error });
    return res.status(200).send({ data });
  }

  @Get('/bankcodes')
  async bnakCodes(@Response() res: any) {
    const { error, data } = await this.paystackService.getBankCodes();
    if (error) return res.status(400).send({ error });
    return res.status(200).send({ data });
  }
}
