const fetch = require('node-fetch')
const Deployment = require('../../metrics/deploymentFrequency/model/deployment')

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
            return jobBuilds.map(build => new Deployment(jobData.tenant, jobData.deployable, build.number, build.timestamp ))
        }))

        return allBuilds.flat()
    }
}

module.exports = config => new Jenkins(config)