const faker = require('faker')
const database = require('../../infrastructure/database')
const ChangeSet = require('../../../src/metrics/leadTimeForChanges/model/changeSet')
const Change = require('../../../src/metrics/leadTimeForChanges/model/change')
const ChangeSetFilter = require('../../../src/metrics/leadTimeForChanges/filter')

describe('Lead Time For Changes Filter', () => {
    const TENANT = faker.name.firstName()
    const DEPLOYABLE = faker.random.uuid()
    const COMMIT_ID = faker.random.uuid()
    const WHEN_CHANGE_HAPPENED = +(new Date())
    const WHEN_CHANGESET_DEPLOYED = faker.random.number(1000, 2000)

    let db;

    const changeFrom = (commitId, happened) => new Change(commitId, happened)
    const changeFilter = async ({ given }) => {
        await Promise.all(given.map(async ({ tenant, deployable, commitId, happened }) => {
            await db("fkm_ldfc_commits").insert({ tenant, deployable, commit_id: commitId, happened })
        }))

        return ChangeSetFilter(db)
    }

    const otherRandomChange = () => ({ tenant: TENANT, deployable: DEPLOYABLE, commitId: faker.random.uuid(), happened: +(new Date()) })

    beforeEach(async () => {
        db = await database.setupDatabase()
    })

    afterEach(async () => {
        await database.teardownDatabase(db)
    })

    it('should filter out any changes already processed', async () => {
        const currentChangeset = new ChangeSet(TENANT, DEPLOYABLE, WHEN_CHANGESET_DEPLOYED, [ changeFrom(COMMIT_ID, WHEN_CHANGE_HAPPENED)])
        const filter = await changeFilter({ given: [ otherRandomChange() ]})

        const shouldBeProcessed = await filter(currentChangeset)
        expect(shouldBeProcessed).toEqual(currentChangeset)
    })
})