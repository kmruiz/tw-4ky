const knex = require('knex')

module.exports.setupDatabase = async () => {
    const db = knex({ client: 'sqlite3', connection: ':memory:', useNullAsDefault: false })
    await db.migrate.latest()
    return db
}

module.exports.teardownDatabase = async (db) => {
    await db.migrate.rollback()
}