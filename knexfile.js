module.exports = {
  development: {
    client: 'sqlite3',
    wrapIdentifier: (value) => value,
    connection: {
      filename: './.dev/database.sqlite3'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    searchPath: ['public'],
    wrapIdentifier: (value) => value
  }
};
