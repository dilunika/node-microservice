/**
 * Created by dilunika on 28/06/17.
 */
const request = require('supertest');
const assert  = require('chai').assert;

const api = request('http://localhost:5501/users');
const user = {
    firstName: 'Kasun',
    lastName: 'Dilunika',
    email: 'k@y.com',
    password: 'secret',
    role: 1
};

it('Create new user', () => {
    return api.post('/')
        .send(user)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .then(res => assertUserIsCreated(res.body.user));
});

function assertUserIsCreated(createdUser) {

    console.log(JSON.stringify(createdUser));
    assert.isNotNull(createdUser.id);
    assert(createdUser.email, user.email);
}