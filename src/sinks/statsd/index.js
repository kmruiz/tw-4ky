const StatsD = require('node-statsd')

class StatsDSink {
    constructor({ client, config }) {
        this.client = client ||  new StatsD(config);
    }

    deploymentHappened(tenant, deployable) {
        this.client.gauge('4km.deployment', 1, 1, [ tenant, deployable ])
    }
}

module.exports = setup => new StatsDSink(setup)