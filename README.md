# Wallet Service
## Hosted on Heroku 
[ol4-Wallet](https://ol4-wallet.herokuapp.com/api/v1)

## Tools
- **Nodejs**
- **Nestjs**
- **Typescript**
- **Mysql** - SQL Database
- **Jest** Test framework
- **Supertest** Test framework
- **Docker** Container
- **Knexjs** DB Migration
- **ObjectionJS** ORM
- **Paystack** Payment bed

## Endpoints
- Users [/users]
  1. Register new user [/register][POST]
  2. login [/login][POST]
  3. Get all users [/?queries][GET]
- Wallet [/wallet]
  1. get user wallet[/:id][GET]
  2. Get all users [/?queries][GET]
  3. Fund Account(initial) [/fund/card/init][POST]
  4. Fund Account(charge card auth) [/fund/card/charge][POST]
  5. Withdraw [/withdraw/init][POST]
  6. Withdraw [/withdraw/final][POST]
  7. Transfer to user [/transfer/user][POST]
  8. Add Bank/Recipient [/bank/][POST]
  9. Validate Bank []

## E-R Diagram
<p align="center" background='blue'>
  <img src="er.png" width="450" title="hover text">
</p>

## Environment Variables
1. JWT_SECRET
2. PAYSTACK_PRIVATE
3. PAYSTACK_PUBLIC
4. PAYSTACK_BASE_URL
5. DATABASE_HOST
6. DATABASE_TYPE
7. DATABASE_USER
8. DATABASE_PASS
9. DATABASE_PORT
10. DATABASE_NAME

are to be store in the .env file

## Run instructions
Download/ clone the main branch.
Run the following commands
npm run install - to install all dependecies
npx knex migrate:latest - To run migrations
npm run test - to run tests
npm run start:dev - to run in dev environment
