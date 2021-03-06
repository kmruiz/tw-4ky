exports.up = async function(knex) {
    await knex.schema.createTable('fkm_ldfc_commits', function (table) {
        table.string('tenant').notNullable()
        table.string('deployable').notNullable()
        table.string('commit_id').notNullable()
        table.datetime('happened').notNullable();

        table.primary([ 'tenant', 'deployable', 'commit_id' ]);
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTable('fkm_ldfc_commits');
};
