const faker = require('faker')
const nock = require('nock')
const Jenkins = require('../../../src/sources/jenkins')

describe('Jenkins Source', () => {
    const HOST = 'http://localhost:8080'
    const AUTH = faker.random.uuid()
    const TENANT = 'myself'
    const SERVICE = 'my-service'
    const JOB = 'test-pipeline'
    const EXTERNAL_ID = 1
    const HAPPENED = 1585066253159

    const server = nock(HOST, {
        reqheaders: {
          authorization: AUTH,
        }
    })

    const jenkins = Jenkins({
        connection: {
            url: HOST,
            authorization: AUTH
        },
        services: [{
            'tenant': TENANT,
            'deployable': SERVICE,
            'job': JOB
        }]
    })

    beforeEach(() => {
        server.get('/api/json?tree=jobs[name]{0,50}')
            .reply(200, {
                jobs: [{ name: 'test-pipeline' }]
            })

        server.get('/job/test-pipeline/api/json?tree=builds[number,timestamp,result]{0,50}')
            .reply(200, {
                builds: [{
                    number: EXTERNAL_ID,
                    timestamp: HAPPENED
                }]
            })
    })

    it('should return a list of deployments based on the configuration', async () => {
        const deployments = await jenkins.deployments()

        expect(deployments.length).toEqual(1)
        expect(deployments[0]).toEqual({ tenant: TENANT, deployable: SERVICE, externalId: EXTERNAL_ID, happened: HAPPENED })
    })
})