import {
  Controller,
  Post,
  Body,
  Response,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async signup(@Response() res, @Body() createUserDto: CreateUserDto) {
    try {
      const { error, data } = await this.usersService.create(createUserDto);
      if (error) {
        return res.status(400).send({ error });
      }
      return res
        .status(201)
        .send({ message: 'user successfully created', data: data[0] });
    } catch (error) {
      return res.status(500).send({ error });
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id/')
  async getDetails(@Response() res, @Param('id') user_id) {
    console.log(user_id);
    try {
      const { error, data } = await this.usersService.getDetails(user_id);
      if (error) {
        return res.status(400).send({ error });
      }

      return res.status(200).send({ data });
    } catch (error) {
      return res.status(500).send('Contact support');
    }
  }
}
