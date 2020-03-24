module.exports = db => async deployment => {
    const result = (await db("fkm_df_deployments").count('*', { as: 'count' }).where({
        tenant: deployment.tenant,
        external_id: deployment.externalId,
        deployable: deployment.deployable
    }))[0]

    return result.count === 0
}