import * as controller from './register.controller.js';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model.js';

jest.mock('../models/user.model.js');
jest.mock('bcryptjs');
jest.mock('../services/auth.js');
describe('Given the register controller', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        // User.find.mockReturnValue(User);
        req = { params: {} };
        res = {};
        res.send = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        next = jest.fn();
    });
    describe('When registerUser is triggered', () => {
        describe('And it works (promise is resolved)', () => {
            test('Then call json', async () => {
                req.body = { name: 'Pepe', password: '1234' };
                bcrypt.hashSync.mockReturnValue('encrypted1234');
                UserModel.create.mockReturnValue({
                    name: 'Pepe',
                    password: 'encrypted1234',
                    id: 5,
                });
                // createToken.mockReturnValue('mock_token');
                await controller.userRegister(req, res, next);
                expect(res.json).toHaveBeenCalledWith({
                    // token: 'mock_token',
                    name: 'Pepe',
                    password: 'encrypted1234',
                    id: 5,
                });
            });
        });
        describe('And it does not works (promise is rejected)', () => {
            test('Then call next', async () => {
                req.body = { username: 'Pepe', password: '1234' };
                bcrypt.hashSync.mockReturnValue('encrypted1234');
                UserModel.create.mockRejectedValue(
                    new Error('Error adding user')
                );
                await controller.userRegister(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
        describe('And there is no password', () => {
            test('Then call next', async () => {
                req.body = { password: undefined };
                UserModel.create.mockResolvedValue({});
                bcrypt.hashSync.mockImplementation(() => {
                    throw new Error('Error, no password');
                });
                await controller.userRegister(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
        describe('And there is no user name', () => {
            test('Then call next', async () => {
                UserModel.create.mockResolvedValue(null);
                await controller.userRegister(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });
});
