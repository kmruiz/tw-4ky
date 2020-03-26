module.exports = db => async build => {
    const result = (await db("fkm_cfr_builds").count('*', { as: 'count' }).where({
        tenant: build.tenant,
        build_id: build.build,
        deployable: build.deployable
    }))[0]

    return result.count === 0
}