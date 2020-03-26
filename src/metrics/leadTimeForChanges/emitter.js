const logger = require('../../infrastructure/logger')

module.exports = sink => changeSet => {
    const deploymentHappened = changeSet.happened;
    const changes = changeSet.changes.sort((a, b) => a.happened - b.happened);

    changes.forEach(change => {
        logger.info('changeDeployed', { ...change, duration: deploymentHappened - change.happened })
        sink.changeDeployed(changeSet.tenant, changeSet.deployable, change, deploymentHappened - change.happened)
    })
}