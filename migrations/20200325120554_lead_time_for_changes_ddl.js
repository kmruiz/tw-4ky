exports.up = async function(knex) {
    await knex.schema.createTable('fkm_ldfc_commits', function (table) {
        table.string('tenant')
        table.string('deployable')
        table.string('commit_id')
        table.datetime('happened').notNullable();

        table.primary([ 'tenant', 'deployable', 'commit_id' ]);
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTable('fkm_ldfc_commits');
};
