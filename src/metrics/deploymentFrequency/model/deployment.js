module.exports = class {
    constructor(tenant, deployable, externalId, happened) {
        this.tenant = tenant
        this.deployable = deployable
        this.externalId = externalId
        this.happened = happened
    }
}