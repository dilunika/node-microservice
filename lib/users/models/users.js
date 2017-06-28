var db = require("datastore");
var log = require('metalogger')();
var Promise = require('bluebird');

class Users {

    getUsers() {
        var conn = db.conn();
        return conn.query('select `email`, `uuid`, `last_updated` from users');
    }

    selectUserById(id) {

        const conn = db.conn();
        return conn.query('select * from users where id = ?', [id]);
    }

    insertUser(user) {

        const conn = db.conn();
        const row = {
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            password: user.password,
            role_id: user.role
        };

        return conn.query('INSERT INTO users SET ?', row);

    }

}

module.exports = Users;