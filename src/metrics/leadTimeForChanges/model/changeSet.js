module.exports = class {
    constructor(tenant, deployable, happened, changes) {
        this.tenant = tenant
        this.deployable = deployable
        this.happened = happened
        this.changes = changes
    }
}