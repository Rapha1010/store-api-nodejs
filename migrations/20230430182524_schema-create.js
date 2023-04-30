/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("users", tbl =>{
        tbl.increments('id');
        tbl.text("user", 20)
            .unique()
            .notNullable();
        tbl.text("name", 20).notNullable();
        tbl.text("email", 20)
            .unique()
            .notNullable();
        tbl.text("cpf", 20)
            .unique()
            .notNullable();
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users")
};
