module.exports = db => async deployment => {
    await db("fkm_df_deployments").insert({
        tenant: deployment.tenant,
        deployable: deployment.deployable,
        external_id: deployment.externalId,
        happened: deployment.happened
    })
}