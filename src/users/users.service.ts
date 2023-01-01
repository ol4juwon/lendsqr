import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { timeStamp } from 'console';
@Injectable()
export class UsersService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  /**
   *
   * @param createUserDto typeof CreateUserDto
   * @returns error|data object
   */
  async create(createUserDto: CreateUserDto) {
    try {
      const emailExists = await this.knex('users').where({
        email: createUserDto.email,
      });
      if (emailExists[0]) return { error: 'user with email already exists' };
      const usernameExists = await this.knex('users').where({
        username: createUserDto.username,
      });
      if (usernameExists[0])
        return { error: 'user with username already exists' };
      createUserDto.password = await bcrypt.hashSync(
        createUserDto.password,
        10,
      );

      const x = await this.knex.transaction(async (trx) => {
        const response = await this.knex('users')
          .insert(createUserDto, '*')
          .transacting(trx)
          .then((id) => {
            return this.knex('wallet')
              .insert({ users_id: id })
              .transacting(trx)
              .then((res) => {
                return res;
              });
          })
          .then(trx.commit)
          .catch(trx.rollback);
        console.log('uj', response);
        return { data: response };
      });
      return { data: x };
    } catch (error) {
      return { error: error.sqlMessage || error.message || error.details };
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const response = await this.knex('users')
        .where({
          email: loginDto.email,
        })
        .limit(1);
      const user = response[0];
      if (user) {
        console.log(user);
        const validPassword = await bcrypt.compare(
          loginDto.password,
          user.password,
        );
        if (!validPassword) return { error: 'username or password incorrect' };
        delete user.password;
        return { data: user };
      }
      console.log(response);
      throw new NotAcceptableException("User doesn't exist");
    } catch (error) {
      return { error: error.sqlMessage || error.message || error.details };
    }
  }
  async getUser(email: string) {
    try {
      const response = await this.knex('users')
        .where({
          email: email,
        })
        .limit(1);
      console.log(response[0]);
      if (response[0]) {
        return response[0];
      }
      return null;
    } catch (error) {
      return null;
    }
  }
  /**
   * getDetails: Get users details
   * @param user_id : int user id
   * @returns error | userDetails object
   */
  async getDetails(user_id: number) {
    try {
      const response = await this.knex('users')
        .select(
          'users.id',
          'users.firstName',
          'users.lastName',
          'users.username',
          'users.email',
          'wallet.balance',
        )
        .where({ 'users.id': user_id })
        .join('wallet', { 'users.id': 'wallet.users_id' });
      const details = response[0];
      details;
      return { data: response[0] };
    } catch (error) {
      return { error: error };
    }
  }
}
