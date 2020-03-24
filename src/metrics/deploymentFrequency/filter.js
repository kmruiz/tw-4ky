module.exports = db => async deployment => {
    const result = (await db("4km_df_deployments").count('*', { as: 'count' }).where({
        tenant: deployment.tenant,
        external_id: deployment.externalId
    }))[0]

    return result.count === 0
}