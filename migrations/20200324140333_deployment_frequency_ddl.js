
exports.up = async function(knex) {
    await knex.schema.createTable('4km_df_deployments', function (table) {
        table.string('tenant');
        table.string('external_id');
        table.datetime('happened').notNullable();

        table.unique([ 'tenant', 'external_id' ]);
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTable('4km_df_deployments');
};
