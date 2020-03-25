const faker = require('faker')
const nock = require('nock')
const Jenkins = require('../../../src/sources/jenkins')
const Change = require('../../../src/metrics/leadTimeForChanges/model/change')
const ChangeSet = require('../../../src/metrics/leadTimeForChanges/model/changeSet')

describe('Jenkins Source', () => {
    const HOST = 'http://localhost:8080'
    const AUTH = faker.random.uuid()
    const TENANT = 'myself'
    const SERVICE = 'my-service'
    const JOB = 'test-pipeline'
    const EXTERNAL_ID = 1
    const HAPPENED = 1585066253159

    const DEPLOYMENT_DURATION = faker.random.number(1000, 100000)
    const DEPLOYMENT_STARTED = faker.random.number(1000, 100000)
    const CHANGE_FIRST_TIMESTAMP = faker.random.number(100, 1000)
    const CHANGE_FIRST_COMMIT = faker.random.uuid()
    const CHANGE_SECOND_TIMESTAMP = faker.random.number(100, 1000)
    const CHANGE_SECOND_COMMIT = faker.random.uuid()

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
                jobs: [{ name: 'test-pipeline' }, { name: faker.random.uuid() }]
            })

        server.get('/job/test-pipeline/api/json?tree=builds[number,timestamp,result]{0,50}')
            .reply(200, {
                builds: [{
                    number: EXTERNAL_ID,
                    timestamp: HAPPENED,
                    result: "SUCCESS" 
                },{
                    number: EXTERNAL_ID,
                    timestamp: HAPPENED,
                    result: "FAILED" 
                }]
            })
        
        server.get('/api/json?tree=jobs[name,builds[number,timestamp,result,duration,changeSets[items[commitId,timestamp]]]]{0,50}')
            .reply(200, {
                "jobs": [
                  {
                    "name": "test-pipeline",
                    "builds": [
                      {
                        "duration": DEPLOYMENT_DURATION,
                        "number": 15,
                        "result": "SUCCESS",
                        "timestamp": DEPLOYMENT_STARTED,
                        "changeSets": [
                          {
                            "items": [
                              {
                                "commitId": CHANGE_FIRST_COMMIT,
                                "timestamp": CHANGE_FIRST_TIMESTAMP
                              },
                              {
                                "commitId": CHANGE_SECOND_COMMIT,
                                "timestamp": CHANGE_SECOND_TIMESTAMP
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              })
    })

    it('should return a list of deployments based on the configuration', async () => {
        const deployments = await jenkins.deployments()

        expect(deployments.length).toEqual(1)
        expect(deployments[0]).toEqual({ tenant: TENANT, deployable: SERVICE, externalId: EXTERNAL_ID, happened: HAPPENED })
    })

    it('should return a changeset with all the commits', async () => {
        const expected = new ChangeSet(TENANT, SERVICE, DEPLOYMENT_STARTED + DEPLOYMENT_DURATION, [
            new Change(CHANGE_FIRST_COMMIT, CHANGE_FIRST_TIMESTAMP),
            new Change(CHANGE_SECOND_COMMIT, CHANGE_SECOND_TIMESTAMP),
        ])

        const changeSets = await jenkins.changeSets()
        expect(changeSets.length).toEqual(1)
        expect(changeSets[0]).toEqual(expected)
    })
})