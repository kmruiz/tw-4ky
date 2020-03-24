
exports.up = async function(knex) {
    await knex.schema.createTable('fkm_df_deployments', function (table) {
        table.string('tenant')
        table.string('deployable')
        table.string('external_id')
        table.datetime('happened').notNullable();

        table.primary([ 'tenant', 'external_id', 'deployable' ]);
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTable('fkm_df_deployments');
};
