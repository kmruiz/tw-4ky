const fetch = require('node-fetch')
const Deployment = require('./metrics/deploymentFrequency/model/deployment')

const exporter = {
    deploymentHappened: console.log
}

const config = require('../knexfile')
const db = require('knex')(process.env.ENVIRONMENT === 'production' ? config.production : config.development)
const deploymentFrequency = require('./metrics/deploymentFrequency')(db, exporter);

//
(async function () {
  const response = await fetch("http://localhost:8080/job/test-pipeline/api/json?tree=builds[number,timestamp,result,duration,url]{0,50}", {
    headers: {
      "Authorization": "Basic YWRtaW46MDQwOWFkNDk4MTcwNGEzZWEyMzc1MWY5NTZkZWRlOTA=",
      "Accept": "application/json"
    }
  });
  const body = await response.json()
  const builds = body.builds

  const deployments = builds.map(build => new Deployment('me', 'test-pipeline', build.number, build.timestamp))
  
  deployments.forEach(deploymentFrequency)
})()
