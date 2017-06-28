/* jshint -W079 */
const Promise = require('bluebird')
    , config = require('config')
    , logger = require('metalogger')()
    , representor = require('representor-serializer')
    , _ = require('lodash');

var actions = {}
    , Users = require("users/models/users")
    , model = new Users();

const responseMediaType = 'application/hal+json';

actions.getUsers = function (req, res, next) {

    logger.info('Get users request => ', req.headers);

    model.getUsers().then(function (userRows) {

        var response = {};
        response.data = {};
        response.data.users = userRows;
        response.actions = [];
        response.actions[0] = {
            "href": "/users",
            "name": "self"
        };

        // Render internal representation into proper HAL+JSON
        response = representor(response, responseMediaType);

        res.set('Content-Type', responseMediaType)
            .status(200)
            .send(response);

    }).catch(function (err) {
        next(err);
    });

};

actions.getUserById = (req, res, next) => {

    model.selectUserById(req.params.id)
        .then(results => respondWithFetchedUser(results, res))
        .catch(err => next(err));
};

actions.addUser = function (req, res, next) {

    const user = req.body;
    model.insertUser(user)
        .then(results => respondWithCreatedUser(results, user, res))
        .catch(err => next(err));
};

function respondWithCreatedUser(results, user, res) {

    const response = userResponse(user, results.insertId);

    res.set('Content-Type', responseMediaType)
        .status(201)
        .send(response);
}

function respondWithFetchedUser(results, res) {


    const user = results[0];
    const response = userResponse(user, user.id);

    res.set('Content-Type', responseMediaType)
        .status(200)
        .send(response);
}

function userResponse(user, userId) {

    const u = {
        id: userId,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        password: user.password
    };

    const href = '/users/' + u.id;

    let response = {
        data: {user: u},
        actions: [
            { href, name: "self"}
        ]
    };

    return representor(response, responseMediaType);
}

module.exports = actions;