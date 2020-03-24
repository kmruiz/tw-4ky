module.exports = db => async deployment => {
    const result = (await db("4km_df_deployments").count('*', { as: 'count' }).where({
        tenant: deployment.tenant,
        external_id: deployment.external_id
    }))[0]

    return result.count === 0
}