//const request = require('request')
const Deployment = require('./metrics/deploymentFrequency/model/deployment')

const exporter = {
    deploymentHappened: console.log
}
const db = require('knex')('../knexfile.js')
const deploymentFrequency = require('./metrics/deploymentFrequency')(db, exporter)

const sample = {
    "_class": "org.jenkinsci.plugins.workflow.job.WorkflowJob",
    "builds": [
      {
        "_class": "org.jenkinsci.plugins.workflow.job.WorkflowRun",
        "duration": 15728,
        "number": 1,
        "result": "SUCCESS",
        "timestamp": 1585066253159,
        "url": "http://localhost:8080/job/test-pipeline/1/"
      }
    ]
  }

sample.builds.forEach(build => {
    deploymentFrequency(new Deployment('TENANT', 'DEPLOYABLE', '1', (+ new Date())))
})