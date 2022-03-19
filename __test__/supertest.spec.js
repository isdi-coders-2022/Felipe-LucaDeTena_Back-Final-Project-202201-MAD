import request from 'supertest';
import { app, server } from '../index.js';
import { itemModel } from '../models/item.model.js';
import { collectionModel } from '../models/collection.model.js';
import { userModel } from '../models/user.model.js';
import { createToken } from '../services/auth.js';
import data from '../data/task.data.js';
import { installUsers } from '../services/db.js';

import request from 'supertest';
import { app, server } from '../index.js';
import { collectionCreator } from '../models/task.model.js';
import { userCreator } from '../models/user.model.js';
import { createToken } from '../services/auth.js';
import data from '../data/task.data.js';
import { installUsers } from '../services/db.js';

describe('Given the test database with a initial Task collection', () => {
    // const collection = '';
    let Task;
    let authToken;
    let firstTaskId;
    let firstUserId;

    beforeAll(() => {
        server.close();
    });

    beforeEach(async () => {
        await installUsers(data.users);
        const User = userCreator();
        const mockUsers = await User.find({});
        firstUserId = mockUsers[0].id;
        console.log({ firstUserId });
        const mockCollections = mockCollection.map((item, i) => {
            const index = i <= 1 ? i : 0;
            return { ...item, createdBy: mockUsers[index]._id };
        });
        Task = taskCreator();
        await Task.deleteMany({});
        const result = await Task.insertMany(mockTasks);
        firstTaskId = result[0].id;
        console.log(firstTaskId);

        authToken = createToken({
            name: mockUsers[0].name,
            id: mockUsers[0].id,
        });
    });

    afterEach(() => {
        // connection.disconnect();
        server.close();
    });

    describe('When the request is GET /tasks ', function () {
        describe('with authentication', () => {
            test('responds with json & status 200', async function () {
                const response = await request(app)
                    .get('/collections')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'bearer ' + authToken);
                expect(response.statusCode).toBe(200);
            });
        });

        describe('without authentication', function () {
            test('responds with json & status 401', async function () {
                const response = await request(app).get('/collections');
                expect(response.statusCode).toBe(401);
            });
        });
    });

    describe('When the request is GET /tasks/:id (no protected)', function () {
        describe('with authentication', () => {
            test('responds with status 200', async function () {
                const response = await request(app)
                    .get('/tasks/' + firstTaskId)
                    .set('Authorization', 'bearer ' + authToken);
                expect(response.statusCode).toBe(200);
            });
        });
        describe('wthout authentication', function () {
            test('responds with status 200', async function () {
                const response = await request(app).get(
                    '/tasks/' + firstTaskId
                );
                expect(response.statusCode).toBe(200);
            });
        });
        describe('with authentication, and invalid id', () => {
            test('responds with status 200', async function () {
                const response = await request(app)
                    .get('/tasks/' + firstUserId)
                    .set('Authorization', 'bearer ' + authToken);
                expect(response.statusCode).toBe(200);
                expect(response.body).toBe(null);
            });
        });
        describe('with authentication, and malformed id', () => {
            test('responds with status 500', async function () {
                const response = await request(app)
                    .get('/tasks/' + '22')
                    .set('Authorization', 'bearer ' + authToken);
                expect(response.statusCode).toBe(500);
            });
        });
    });

    describe('When the request is POST /tasks/ (no protected)', () => {
        describe('and the data in the body are ok', () => {
            test('responds with status 200', async () => {
                const task = {
                    title: 'Tarea adicional',
                    responsible: firstUserId,
                    isCompleted: false,
                };
                const response = await request(app)
                    .post('/tasks')
                    .send(task)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200);
                expect(response.statusCode).toBe(200);
            });
        });
        describe('and the data in the body are uncompleted', () => {
            test('responds with status 406', async () => {
                const task = {
                    title: 'Otra Tarea adicional',
                    responsible: firstTaskId,
                    isCompleted: false,
                };
                const response = await request(app)
                    .post('/tasks')
                    .send(task)
                    .set('Accept', 'application/json')
                    .expect(406);
                expect(response.statusCode).toBe(406);
                expect(response.body).toBe(null);
            });
        });
    });

    describe('When the request is PATCH /tasks/ (no protected)', () => {
        describe('with authentication', () => {
            test('responds with status 200', async () => {
                const task = {
                    isCompleted: true,
                };
                // eslint-disable-next-line no-unused-vars
                const response = await request(app)
                    .patch('/tasks/' + firstTaskId)
                    .send(task)
                    .set('Authorization', 'bearer ' + authToken)
                    .expect(200);
            });
        });
        describe('without authentication', () => {
            test('responds with status 200', async () => {
                const task = {
                    isCompleted: true,
                };
                // eslint-disable-next-line no-unused-vars
                const response = await request(app)
                    .patch('/tasks/' + firstTaskId)
                    .send(task)
                    .expect(401);
            });
        });
    });

    describe('DELETE /tasks', function () {
        describe('with authentication', () => {
            test('responds with json', async function () {
                // eslint-disable-next-line no-unused-vars
                const response = await request(app)
                    .delete('/tasks/' + firstTaskId)
                    .set('Authorization', 'bearer ' + authToken)
                    .expect(202);
            });
        });
        describe('retrying with authentication (no document)', () => {
            test('responds with json', async function () {
                // eslint-disable-next-line no-unused-vars
                const response = await request(app)
                    .delete('/tasks/' + firstUserId)
                    .set('Authorization', 'bearer ' + authToken)
                    .expect(401);
            });
        });
        describe('without authentication', () => {
            test('responds with json', async function () {
                const response = await request(app)
                    .delete('/tasks/' + firstTaskId)
                    .expect(401);
                expect(response.statusCode).toBe(401);
            });
        });
    });

    describe('When the request is GET /users ', function () {
        test('responds with json & status 200', async function () {
            const response = await request(app).get('/users');
            expect(response.statusCode).toBe(200);
        });
    });

    describe('When the request is POST /users ', function () {
        describe('And user is valid', () => {
            test('responds with json & status 200', async function () {
                const user = { name: 'María', passwd: '12345' };
                const response = await request(app).post('/users').send(user);
                expect(response.statusCode).toBe(200);
            });
        });
        describe('And user is not valid', () => {
            test('responds with json & status 200', async function () {
                const user = {};
                const response = await request(app).post('/users').send(user);
                expect(response.statusCode).toBe(500);
            });
        });
    });

    describe('When the request is POST /login ', function () {
        describe('When user is valid', () => {
            test('responds with json & status 200', async function () {
                const user = { name: 'Pepe', passwd: '1234' };
                const response = await request(app)
                    .post('/login')
                    .set('Accept', 'application/json')
                    .send(user);
                expect(response.statusCode).toBe(200);
            });
        });
        describe('When user is not valid', () => {
            test('responds with json & status 401', async function () {
                const user = { name: 'Marta', passwd: '12345' };
                const response = await request(app)
                    .post('/login')
                    .set('Accept', 'application/json')
                    .send(user);
                expect(response.statusCode).toBe(401);
            });
        });
        describe('When passwd is not valid', () => {
            test('responds with json & status 401', async function () {
                const user = { name: 'Pepe', passwd: '346578' };
                const response = await request(app)
                    .post('/login')
                    .set('Accept', 'application/json')
                    .send(user);
                expect(response.statusCode).toBe(401);
            });
        });
        describe('When there are not user or passwd', () => {
            test('responds with json & status 401', async function () {
                const user = { name: 'Marta' };
                const response = await request(app)
                    .post('/login')
                    .set('Accept', 'application/json')
                    .send(user);
                expect(response.statusCode).toBe(401);
            });
        });
    });
});
