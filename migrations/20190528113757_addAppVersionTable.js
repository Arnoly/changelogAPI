
exports.up = function(knex, Promise) {
    return knex.schema.createTable( 'appVersion', table => {
        table.increments('id');
        table.string('appName');
        table.float('appVersion');
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('appVersion');
};
