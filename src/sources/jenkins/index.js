const fetch = require('node-fetch')
const Deployment = require('../../metrics/deploymentFrequency/model/deployment')
const ChangeSet = require('../../metrics/leadTimeForChanges/model/changeSet')
const Change = require('../../metrics/leadTimeForChanges/model/change')

const queryAllJobs = async (connection) => {
    const response = await fetch(`${connection.url}/api/json?tree=jobs[name]{0,50}`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': connection.authorization
        }
    })

    const body = await response.json()
    return body.jobs
}

const queryBuilds = async (connection, job) => {
    const response = await fetch(`${connection.url}/job/${job}/api/json?tree=builds[number,timestamp,result]{0,50}`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': connection.authorization
        }
    })

    const body = await response.json()
    return body.builds
}

const queryJobsAndChangeSets = async (connection) => {
    const response = await fetch(`${connection.url}/api/json?tree=jobs[name,builds[number,timestamp,result,duration,changeSets[items[commitId,timestamp]]]]{0,50}`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': connection.authorization
        }
    })

    const body = await response.json()
    return body.jobs
}

class Jenkins {
    constructor(config) {
        this.config = config
        this.tenancy = config.services.reduce((tenants, service) => ({ ...tenants, [service.job]: service }), {})
    }

    async deployments() {
        const jobs = await queryAllJobs(this.config.connection)
        const jobsData = jobs.map(job => {
            if (this.tenancy[job.name] !== undefined) {
                return { ...this.tenancy[job.name], ...job }
            }

            return undefined
        }).filter(job => job !== undefined)

        const allBuilds = await Promise.all(jobsData.map(async jobData => {
            const jobBuilds = await queryBuilds(this.config.connection, jobData.name)
            return jobBuilds
                .filter(jobData => jobData.result === 'SUCCESS')
                .map(build => new Deployment(jobData.tenant, jobData.deployable, build.number, build.timestamp ))
        }))

        return allBuilds.flat()
    }

    async changeSets() {
        const jobs = await queryJobsAndChangeSets(this.config.connection)
        return jobs.flatMap(job => {
            if (this.tenancy[job.name] === undefined) {
                return undefined
            }

            const tenancy = this.tenancy[job.name]
            return job.builds.map(build => {
                const changeSetDeployed = build.timestamp + build.duration
                const changes = build.changeSets[0].items.map(item => new Change(item.commitId, item.timestamp))
                return new ChangeSet(tenancy.tenant, tenancy.deployable, changeSetDeployed, changes)
            })
        })
    }
}

module.exports = config => new Jenkins(config)