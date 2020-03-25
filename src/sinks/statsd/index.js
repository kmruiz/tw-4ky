const StatsD = require('node-statsd')

class StatsDSink {
    constructor({ client, config }) {
        this.client = client ||  new StatsD(config);
    }

    deploymentHappened(deployment) {
        this.client.increment(`fkm.deploymentfrequency.${deployment.tenant}.${deployment.deployable}.deployment`, 1, 1, [ deployment.tenant, deployment.deployable ])
    }
}

module.exports = setup => new StatsDSink(setup)