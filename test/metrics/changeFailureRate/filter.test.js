const faker = require('faker')
const database = require('../../infrastructure/database')
const Build = require('../../../src/metrics/changeFailureRate/model/build')
const BuildFilter = require('../../../src/metrics/changeFailureRate/filter')

describe('Change Failure Rate Build Filter', () => {
    const TENANT = faker.name.firstName()
    const DEPLOYABLE = faker.random.uuid()
    const BUILD = faker.random.uuid()
    const STATUS = faker.random.uuid()
    const WHEN_HAPPENED = +(new Date())

    let db;

    const buildFrom = (tenant, deployable, build, status, happened) => new Build(tenant, deployable, build, status, happened)
    const buildFilter = async ({ given }) => {
        await Promise.all(given.map(async ({ tenant, deployable, build, status, happened }) => {
            await db("fkm_cfr_builds").insert({ tenant, deployable, build_id: build, build_status: status, happened })
        }))

        return BuildFilter(db)
    }

    const otherRandomBuild = () => 
        new Build(faker.name.firstName(), faker.random.uuid(), faker.random.uuid(), faker.random.uuid(), +(new Date()))

    beforeEach(async () => {
        db = await database.setupDatabase()
    })

    afterEach(async () => {
        await database.teardownDatabase(db)
    })

    it('should accept any builds that have not been processed', async () => {
        const currentBuild = buildFrom(TENANT, DEPLOYABLE, BUILD, STATUS, WHEN_HAPPENED)
        const filter = await buildFilter({ given: [ otherRandomBuild() ] })

        const shouldBeProcessed = await filter(currentBuild)
        expect(shouldBeProcessed).toBeTruthy()
    })

    it('should discard any deployments that have been already processed', async () => {
        const currentBuild = buildFrom(TENANT, DEPLOYABLE, BUILD, STATUS, WHEN_HAPPENED)
        const filter = await buildFilter({ given: [ currentBuild ] })

        const shouldBeProcessed = await filter(currentBuild)
        expect(shouldBeProcessed).toBeFalsy()
    })
})