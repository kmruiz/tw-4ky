const faker = require('faker')
const database = require('../../infrastructure/database')
const Deployment = require('../../../src/metrics/deploymentFrequency/model/deployment')
const DeploymentFilter = require('../../../src/metrics/deploymentFrequency/filter')

describe('Deployment Frequency Filter', () => {
    const TENANT = faker.name.firstName()
    const DEPLOYABLE = faker.random.uuid()
    const ID = faker.random.uuid()
    const WHEN_HAPPENED = +(new Date())

    let db;

    const deploymentFrom = (tenant, deployable, id, happened) => new Deployment(tenant, deployable, id, happened)
    const deploymentFilter = async ({ given }) => {
        await Promise.all(given.map(async ({ tenant, deployable, externalId, happened }) => {
            await db("4km_df_deployments").insert({ tenant, deployable, external_id: externalId, happened })
        }))

        return DeploymentFilter(db)
    }

    const otherRandomDeployment = () => 
        new Deployment(faker.name.firstName(), faker.random.uuid(), faker.random.uuid(), +(new Date()))

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
        const currentDeployment = deploymentFrom(TENANT, DEPLOYABLE, ID, WHEN_HAPPENED)
        const filter = await deploymentFilter({ given: [ currentDeployment ] })

        const shouldBeProcessed = await filter(currentDeployment)
        expect(shouldBeProcessed).toBeFalsy()
    })
})