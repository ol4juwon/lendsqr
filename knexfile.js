/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql2',
    useNullAsDefault: true,
    connection: {
      host: 'us-cdbr-east-06.cleardb.net',
      user: 'b3742b37b1e256',
      password: '4f50d6f5',
      database: 'heroku_4c7c865c7df2a21',
    },
  },

  staging: {
    client: 'mysql2',
    useNullAsDefault: true,
    connection: {
      host: 'us-cdbr-east-06.cleardb.net',
      user: 'b3742b37b1e256',
      password: '4f50d6f5',
      database: 'heroku_4c7c865c7df2a21',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'mysql2',
    connection: {
      host: 'us-cdbr-east-06.cleardb.net',
      user: 'b3742b37b1e256',
      password: '4f50d6f5',
      database: 'heroku_4c7c865c7df2a21',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
