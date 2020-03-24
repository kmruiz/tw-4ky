const faker = require('faker')
const database = require('../../infrastructure/database')
const Deployment = require('../../../src/metrics/deploymentFrequency/model/deployment')
const DeploymentDirectory = require('../../../src/metrics/deploymentFrequency/directory')

describe('Deployment Frequency Directory', () => {
    let TENANT = faker.name.firstName()
    let ID = faker.random.uuid()
    let WHEN_HAPPENED = +(new Date())

    let db;

    const deploymentFrom = (tenant, id, happened) => new Deployment(tenant, id, happened)
    const directory = async () => DeploymentDirectory(db)

    const toExist = async (deployment) => (await db("4km_df_deployments").count('*', { as: 'count' }).where({
        tenant: deployment.tenant,
        external_id: deployment.externalId,
        happened: deployment.happened
    }))[0].count === 1

    beforeEach(async () => {
        db = await database.setupDatabase()
    })

    afterEach(async () => {
        await database.teardownDatabase(db)
    })

    it('should record a deployment that had happened', async () => {
        const deployment = deploymentFrom(TENANT, ID, WHEN_HAPPENED)
        const register = await directory()
        await register(deployment)
        expect(await toExist(deployment)).toBeTruthy()
    })
})