const faker = require('faker')
const database = require('../../infrastructure/database')
const Deployment = require('../../../src/metrics/deploymentFrequency/model/deployment')
const DeploymentFilter = require('../../../src/metrics/deploymentFrequency/filter')

describe('Deployment Frequency Filter', () => {
    let TENANT = faker.name.firstName()
    let ID = faker.random.uuid()
    let WHEN_HAPPENED = +(new Date())

    let db;

    const deploymentFrom = (tenant, id, happened) => new Deployment(tenant, id, happened)
    const deploymentFilter = async ({ given }) => {
        await Promise.all(given.map(async ({ tenant, externalId, happened }) => {
            await db("4km_df_deployments").insert({ tenant, external_id: externalId, happened })
        }))

        return DeploymentFilter(db)
    }

    const otherRandomDeployment = () => 
        new Deployment(faker.name.firstName(), faker.random.uuid(), +(new Date()))

    beforeEach(async () => {
        db = await database.setupDatabase()
    })

    afterEach(async () => {
        await database.teardownDatabase(db)
    })

    it('should accept any deployments that have not been processed', async () => {
        const currentDeployment = deploymentFrom(TENANT, ID, WHEN_HAPPENED)
        const filter = await deploymentFilter({ given: [ otherRandomDeployment() ] })

        const shouldBeProcessed = await filter(currentDeployment)
        expect(shouldBeProcessed).toBeTruthy()
    })


    it('should discard any deployments that have been already processed', async () => {
        const currentDeployment = deploymentFrom(TENANT, ID, WHEN_HAPPENED)
        const filter = await deploymentFilter({ given: [ currentDeployment ] })

        const shouldBeProcessed = await filter(currentDeployment)
        expect(shouldBeProcessed).toBeFalsy()
    })
})