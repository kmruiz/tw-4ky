const faker = require('faker')
const Deployment = require('../../../src/metrics/deploymentFrequency/model/deployment')
const StatsDSink = require('../../../src/sinks/statsd')

describe('StatsD Sink', () => {
    const TENANT = faker.random.uuid()
    const DEPLOYABLE = faker.random.uuid()
    const TIMESTAMP = +(new Date())

    const client = {
        increment: jest.fn()
    }

    beforeEach(() => {
        client.increment.mockReset()
    })

    const sink = () => StatsDSink({ client })

    it('should emit a deployment', () => {
        const currentSink = sink()
        const deployment = new Deployment(TENANT, DEPLOYABLE, faker.random.uuid(), TIMESTAMP)
        currentSink.deploymentHappened(deployment)

        expect(client.increment).toHaveBeenCalledWith(`fkm.${TENANT}.${DEPLOYABLE}.deployment`, 1, 1, [ TENANT, DEPLOYABLE ])
    })
})