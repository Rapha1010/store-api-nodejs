
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3'
    }
})

getAllUsers = function() {
    return knex.select('*').from('users');
}

getUserById = function(userId) {
    return knex.select('*').from('users').where('id', userId);
}

postUser = function(user) {
    return knex('users').insert(user, ['id']);
}

putUser = function(user) {
   return knex("users").update(user).where('id',user.id);
}

deleteUser = function(userId) {
    return knex('users').where('id', userId).del();
}

module.exports = {
    getAllUsers,
    getUserById,
    postUser,
    putUser,
    deleteUser
}