const faker = require('faker')
const Deployment = require('../../../src/metrics/deploymentFrequency/model/deployment')
const DeploymentEmitter = require('../../../src/metrics/deploymentFrequency/emitter')

describe('Deployment Frequency Emitter', () => {
    const TENANT = faker.random.uuid()
    const DEPLOYABLE = faker.random.uuid()

    const sink = {
        deploymentHappened: jest.fn()
    }

    const deploymentFrom = (tenant, deployable, id, happened) => new Deployment(tenant, deployable, id, happened)
    const emitter = () => DeploymentEmitter(sink)

    beforeEach(() => {
        sink.deploymentHappened.mockReset()
    })

    it('should emit the deployment information to the specified exporter', () => {
        const deployment = deploymentFrom(TENANT, DEPLOYABLE, faker.random.uuid(), +(new Date()))
        const currentEmitter = emitter()
        currentEmitter(deployment)

        expect(sink.deploymentHappened).toHaveBeenCalledWith(deployment)
    })
})