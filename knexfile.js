module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './.dev/database.sqlite3'
    },
    wrapIdentifier: (value) => value,
    useNullAsDefault: true
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    wrapIdentifier: (value) => value,
    migrations: {
      tableName: 'MIGRATIONS'
    }
  }
};
