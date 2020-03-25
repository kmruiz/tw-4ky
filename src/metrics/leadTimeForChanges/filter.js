const ChangeSet = require('./model/changeSet')

module.exports = db => async changeSet => {
    const processedCommitsResults = (await db("fkm_ldfc_commits").select("*").where({
        tenant: changeSet.tenant,
        deployable: changeSet.deployable
    }).limit(50).orderBy('happened', 'desc'))

    const processedCommits = new Set(processedCommitsResults.map(r => r.commit_id))
    const nonProcessedChanges = changeSet.changes.filter(change => !processedCommits.has(change.commitId))

    return new ChangeSet(changeSet.tenant, changeSet.deployable, changeSet.happened, nonProcessedChanges)
}