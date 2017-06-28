/**
 * Created by dilunika on 28/06/17.
 */
const request = require('supertest');
const assert  = require('chai').assert;
const faker = require('faker');


const api = request('http://localhost:5501');

describe('/users API', () => {

    it('Create new user', () => {

        const userData = newUser();
        return api.post('/users')
            .send(userData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then(res => assertUserIsCreated(res.body.user, userData));
    });

    it('Get user by id', () => {

        const userData = newUser();
        return api.post('/users')
            .send(userData)
            .then(res => assertSameUserIsFetched(res))
    });
});

function assertUserIsCreated(createdUser, user) {

    assert.isNotNull(createdUser.id);
    assert(createdUser.email, user.email);
}

function newUser() {

    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 1
    };
}

function assertSameUserIsFetched(res) {

    console.log(res.body);
    const user = res.body.user;
    return api.get(res.body._links.self.href)
        .set('Accept', 'application/json')
        .expect(200)
        .then(res => {
           assert(res.body.user.id, user.id);
        });
}