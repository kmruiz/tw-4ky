const faker = require('faker')
const Change = require('../../../src/metrics/leadTimeForChanges/model/change')
const ChangeSet = require('../../../src/metrics/leadTimeForChanges/model/changeSet')
const ChangeSetEmitter = require('../../../src/metrics/leadTimeForChanges/emitter')

describe('Lead Time For Changes Emitter', () => {
    const TENANT = faker.random.uuid()
    const DEPLOYABLE = faker.random.uuid()
    const WHEN_CHANGESET_DEPLOYED = faker.random.number()

    const sink = {
        changeDeployed: jest.fn()
    }

    const changeFor = (commit, happened) => new Change(commit, happened)
    const emitter = () => ChangeSetEmitter(sink)

    beforeEach(() => {
        sink.changeDeployed.mockReset()
    })

    it('should emit the deployment information to the specified exporter', () => {
        const firstChange = changeFor(faker.random.uuid(), WHEN_CHANGESET_DEPLOYED - 2)
        const lastChange = changeFor(faker.random.uuid(), WHEN_CHANGESET_DEPLOYED - 1)
        const changeSet = new ChangeSet(TENANT, DEPLOYABLE, WHEN_CHANGESET_DEPLOYED, [ firstChange, lastChange ])

        const currentEmitter = emitter()
        currentEmitter(changeSet)

        expect(sink.changeDeployed).toHaveBeenCalledWith(changeSet.tenant, changeSet.deployable, firstChange, 2)
        expect(sink.changeDeployed).toHaveBeenCalledWith(changeSet.tenant, changeSet.deployable, lastChange, 1)
    })
})