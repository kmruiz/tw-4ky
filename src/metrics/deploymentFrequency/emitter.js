const logger = require('../../infrastructure/logger')

module.exports = exporter => deployment => {
    logger.info('deploymentHappened', deployment)
    exporter.deploymentHappened(deployment)
}