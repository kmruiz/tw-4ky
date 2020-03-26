exports.up = async function(knex) {
    await knex.schema.createTable('fkm_cfr_builds', function (table) {
        table.string('tenant').notNullable()
        table.string('deployable').notNullable()
        table.string('build_id').notNullable()
        table.string('build_status').notNullable()
        table.datetime('happened').notNullable();

        table.primary([ 'tenant', 'deployable', 'build_id' ]);
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTable('fkm_ldfc_commits');
};
