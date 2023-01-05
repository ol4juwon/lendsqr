import {
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { InjectModel, synchronize } from 'nestjs-objection/dist';
import { Users } from './model/users.model';
@Injectable()
export class UsersService {
  constructor(@InjectModel(Users) private readonly userModel) {}

  /**
   *
   * @param createUserDto typeof CreateUserDto
   * @returns error|data object
   */
  async create(createUserDto: CreateUserDto) {
    try {
      const emailExists = await this.userModel.query().where({
        email: createUserDto.email,
      });
      if (emailExists[0]) return { error: 'user with email already exists' };
      const usernameExists = await this.userModel.query().where({
        username: createUserDto.username,
      });
      if (usernameExists[0])
        return { error: 'user with username already exists' };
      createUserDto.password = await bcrypt.hashSync(
        createUserDto.password,
        10,
      );
      // const user = await this.userModel.query().insert(createUserDto);
      const role = createUserDto.roles.join(',');
      delete createUserDto.roles;
      const newUser = { ...createUserDto, role };
      const trx = await this.userModel
        .transaction(async (trx) => {
          const addingUser = await this.userModel.query().insert(newUser);
          console.log(addingUser);
          const wallet = await addingUser
            .$relatedQuery('wallet', trx)
            .insert({ users_id: addingUser[0] });
          return wallet;
        })
        .catch((error) => {
          return { error };
        });
      console.log('Done', trx);
      return { data: trx };
    } catch (error) {
      return { error: error.sqlMessage || error.message || error.details };
    }
  }
  async findAll() {
    try {
      await synchronize(Users);

      const user = await this.userModel
        .query()
        .select('*')
        .withGraphFetched('wallet')
        .withGraphFetched('transactions')
        .withGraphFetched('banks')
        .modifyGraph('wallet', (w) => w.select(['wallet.balance']))
        .modifyGraph('transactions', (t: any) =>
          t
            .select([
              'transactions.id',
              'transactions.amount',
              'transactions.status',
            ])
            .limit(10)
            .orderBy('transactions.created_at', 'ASC'),
        );
      return { data: user };
    } catch (error) {
      return { error };
    }
  }
  async login(loginDto: LoginDto) {
    try {
      const response = await this.userModel
        .query()
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
    await synchronize(Users);
    console.log('eee', email);
    try {
      const response = await this.userModel
        .query()
        .select()
        .where({
          email: email,
        })
        .limit(1);
      console.log(response);
      if (response[0]) {
        return response[0];
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async getIdByUsername(username: string) {
    try {
      const response = await this.userModel
        .query()
        .where({
          username: username,
        })
        .limit(1);
      console.log(response[0].id);
      if (response[0]) {
        return { data: response[0].id };
      }
      return { error: 'not found' };
    } catch (error) {
      return { error: 'contact support' };
    }
  }
  /**
   * getDetails: Get users details
   * @param user_id : int user id
   * @returns error | userDetails object
   */
  async getDetails(user_id: number) {
    try {
      const response = await this.userModel
        .query()
        .select([
          'users.id',
          'users.firstName',
          'users.lastName',
          'users.username',
          'users.email',
          'wallet.balance',
        ])
        .where({ 'users.id': user_id })
        .join('wallet', { 'users.id': 'wallet.users_id' });
      if (!response[0])
        throw new NotFoundException('User with the id not found');
      return { data: response[0] };
    } catch (error) {
      return { error: error };
    }
  }
}
