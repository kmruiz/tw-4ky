module.exports = db => async changeSet => {
    return await Promise.all(changeSet.changes.map(change => {
        return db("fkm_ldfc_commits").insert({ 
            tenant: changeSet.tenant,
            deployable: changeSet.deployable, 
            commit_id: change.commitId,
            happened: change.happened 
        })
    }))
}