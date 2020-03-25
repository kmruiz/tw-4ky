const faker = require('faker')
const Deployment = require('../../../src/metrics/deploymentFrequency/model/deployment')
const Change = require('../../../src/metrics/leadTimeForChanges/model/change')
const StatsDSink = require('../../../src/sinks/statsd')

describe('StatsD Sink', () => {
    const TENANT = faker.random.uuid()
    const DEPLOYABLE = faker.random.uuid()
    const COMMIT_ID = faker.random.uuid()
    const DURATION = faker.random.number(0, 1000)
    const TIMESTAMP = +(new Date())

    const client = {
        increment: jest.fn(),
        gauge: jest.fn()
    }

    beforeEach(() => {
        client.increment.mockReset()
        client.gauge.mockReset()
    })

    const sink = () => StatsDSink({ client })

    it('should emit a deployment', () => {
        const currentSink = sink()
        const deployment = new Deployment(TENANT, DEPLOYABLE, faker.random.uuid(), TIMESTAMP)
        currentSink.deploymentHappened(deployment)

        expect(client.increment).toHaveBeenCalledWith(`fkm.deploymentfrequency.${TENANT}.${DEPLOYABLE}.deployment`, 1, 1, [ TENANT, DEPLOYABLE ])
    })

    it('should emit a change', () => {
        const currentSink = sink()
        const change = new Change(COMMIT_ID, TIMESTAMP)
        currentSink.changeDeployed(TENANT, DEPLOYABLE, change, DURATION)
        
        expect(client.gauge).toHaveBeenCalledWith(`fkm.leadtimeforchange.${TENANT}.${DEPLOYABLE}.change`, DURATION, 1, [ TENANT, DEPLOYABLE ])
    })
})