const faker = require('faker')
const StatsDSink = require('../../../src/sinks/statsd')

describe('StatsD Sink', () => {
    const TENANT = faker.random.uuid()
    const DEPLOYABLE = faker.random.uuid()

    const client = {
        gauge: jest.fn()
    }

    beforeEach(() => {
        client.gauge.mockReset()
    })

    const sink = () => StatsDSink({ client })

    it('should emit a deployment', () => {
        const currentSink = sink()
        currentSink.deploymentHappened(TENANT, DEPLOYABLE)

        expect(client.gauge).toHaveBeenCalledWith('4km.deployment', 1, 1, [ TENANT, DEPLOYABLE ])
    })
})