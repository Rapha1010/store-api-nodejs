/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("users", tbl => {
        tbl.increments('id');
        tbl.text("login", 20)
            .unique()
            .notNullable();
        tbl.text("name", 100).notNullable();
        tbl.text("email", 100)
            .unique()
            .notNullable();
        tbl.text("password", 100)
            .notNullable();
        tbl.text("roles", 200)
            .notNullable().defaultTo('USER');
    });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("users")
};
