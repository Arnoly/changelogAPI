
exports.up = function(knex, Promise) {
    return knex.schema.createTable( 'appModules', table => {
        table.increments('id');
        table.string('app_id');
        table.string('module_id');
    })

};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('appModules');
};
