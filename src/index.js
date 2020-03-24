const databaseConfiguration = require('../knexfile')
const database = require('knex')(process.env.ENVIRONMENT === 'production' ? 
    databaseConfiguration.production : 
    databaseConfiguration.development
)

const JenkinsSource = require('./sources/jenkins')
const StatsDSink = require('./sinks/statsd')

const source = JenkinsSource({
    connection: {
        url: 'http://localhost:8080',
        authorization: 'Basic YWRtaW46MDQwOWFkNDk4MTcwNGEzZWEyMzc1MWY5NTZkZWRlOTA='
    },
    services: [{
        'tenant': 'myself',
        'deployable': 'deployable',
        'job': 'test-pipeline'
    }]
})

const sink = StatsDSink({})

require('./metrics/deploymentFrequency')(source, database, sink)