module.exports = exporter => deployment => {
    exporter.deploymentHappened(deployment.tenant, deployment.deployable)
}