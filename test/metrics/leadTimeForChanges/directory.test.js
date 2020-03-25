const faker = require('faker')
const database = require('../../infrastructure/database')
const ChangeSet = require('../../../src/metrics/leadTimeForChanges/model/changeSet')
const Change = require('../../../src/metrics/leadTimeForChanges/model/change')
const ChangeSetDirectory = require('../../../src/metrics/leadTimeForChanges/directory')

describe('Lead Time For Changes Directory', () => {
    const TENANT = faker.name.firstName()
    const DEPLOYABLE = faker.random.uuid()
    const COMMIT_ID = faker.random.uuid()
    const WHEN_CHANGE_HAPPENED = +(new Date())
    const WHEN_CHANGESET_DEPLOYED = faker.random.number(1000, 2000)

    const changeFrom = (commitId, happened) => new Change(commitId, happened)
    const directory = async () => ChangeSetDirectory(db)

    const toExist = async (tenant, deployable, change) => (await db("fkm_ldfc_commits").count('*', { as: 'count' }).where({
        tenant: tenant,
        deployable: deployable,
        commit_id: change.commitId,
        happened: change.happened
    }))[0].count === 1

    beforeEach(async () => {
        db = await database.setupDatabase()
    })

    afterEach(async () => {
        await database.teardownDatabase(db)
    })

    it('should record all changes that had happened', async () => {
        const changeSet = new ChangeSet(TENANT, DEPLOYABLE, WHEN_CHANGESET_DEPLOYED, [ changeFrom(COMMIT_ID, WHEN_CHANGE_HAPPENED) ])
        const register = await directory()
        await register(changeSet)
        expect(await toExist(TENANT, DEPLOYABLE, changeSet.changes[0])).toBeTruthy()
    })
})