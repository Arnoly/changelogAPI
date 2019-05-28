
exports.up = function(knex, Promise) {
    return knex.schema.createTable( 'reposList', table => {
        table.increments('id');
        table.string('reposName');
        table.float('reposVersion');
    })

};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('reposList');
};
