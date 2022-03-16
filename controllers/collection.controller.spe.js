import * as controller from './collection.controller.js';
import bcrypt from 'bcryptjs';
import { createToken } from '../services/auth.js';
import { CollectionModel } from '../models/collection.model.js';

jest.mock('../models/collection.model.js');
jest.mock('bcryptjs');
jest.mock('../services/auth.js');

describe('Given the tasks controller', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = { params: {} };
        res = {};
        res.send = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        next = jest.fn();
    });

    describe('When insertCollection is triggered', () => {
        describe('And it works (promise is resolved)', () => {
            beforeEach(() => {
                req.body = { name: 'Pepe', password: '1234' };
                bcrypt.hashSync.mockResolvedValue('encrypted1234');
                CollectionModel.create.mockReturnValue({
                    name: 'Pepe',
                    password: 'encrypted1234',
                    id: 1,
                });
                createToken.mockReturnValue('mock_token');
            });
            test('Then call json', async () => {
                await controller.insertCollection(req, res, next);
                expect(res.json).toHaveBeenCalledWith({
                    token: 'mock_token',
                    CollectionName: 'Pepe',
                    id: 1,
                });
            });
        });
        describe('And it doesnt work (promise is rejected)', () => {
            beforeEach(() => {
                req.body = { name: 'Pepe', password: '1234' };
                bcrypt.hashSync.mockReturnValue('encrypted1234');
                CollectionModel.create.mockRejectedValue(
                    new Error('Error adding Collection')
                );
                // createToken.mockReturnValue('mock_token');
            });
            test('Then call next', async () => {
                await controller.insertCollection(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });
});
