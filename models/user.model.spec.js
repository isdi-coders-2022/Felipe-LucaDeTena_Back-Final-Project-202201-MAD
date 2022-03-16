import mongoose from 'mongoose';
import { userCreator } from './user.model.js';

jest.mock('mongoose');

describe('Given a factory dor create the User Model', () => {
    beforeAll(() => {
        mongoose.Schema.mockImplementation(function () {});
        mongoose.Schema.prototype.set = jest.fn();
        mongoose.model.mockReturnValue({});
    });

    test('Using previous model', () => {
        mongoose.default = { models: { User: {} } };
        const model = userCreator();
        expect(mongoose.Schema.prototype.set).toHaveBeenCalled();
        expect(model).toBeTruthy();
    });
    test('Creating a model', () => {
        mongoose.default = { models: {} };
        const model = userCreator();
        expect(mongoose.Schema.prototype.set).toHaveBeenCalled();
        expect(model).toBeTruthy();
    });
});
