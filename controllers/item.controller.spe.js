import * as controller from './item.controller.js';
import bcrypt from 'bcryptjs';
import { createToken } from '../services/auth.js';
import { ItemModel } from '../models/item.model.js';

jest.mock('../models/Item.model.js');
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

    describe('When insertItem is triggered', () => {
        describe('And it works (promise is resolved)', () => {
            beforeEach(() => {
                req.body = { name: 'Pepe', password: '1234' };
                bcrypt.hashSync.mockResolvedValue('encrypted1234');
                ItemModel.create.mockReturnValue({
                    name: 'Pepe',
                    password: 'encrypted1234',
                    id: 1,
                });
                createToken.mockReturnValue('mock_token');
            });
            test('Then call json', async () => {
                await controller.insertItem(req, res, next);
                expect(res.json).toHaveBeenCalledWith({
                    token: 'mock_token',
                    ItemName: 'Pepe',
                    id: 1,
                });
            });
        });
        describe('And it doesnt work (promise is rejected)', () => {
            beforeEach(() => {
                req.body = { name: 'Pepe', password: '1234' };
                bcrypt.hashSync.mockReturnValue('encrypted1234');
                ItemModel.create.mockRejectedValue(
                    new Error('Error adding Item')
                );
                // createToken.mockReturnValue('mock_token');
            });
            test('Then call next', async () => {
                await controller.insertItem(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });
});
