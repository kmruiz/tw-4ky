module.exports = class {
    constructor(tenant, deployable, build, status, happened) {
        this.tenant = tenant
        this.deployable = deployable
        this.build = build
        this.status = status
        this.happened = happened
    }
}