module.exports = db => async deployment => {
    await db("4km_df_deployments").insert({
        tenant: deployment.tenant,
        external_id: deployment.externalId,
        happened: deployment.happened
    })
}