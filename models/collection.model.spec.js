import { mongoConnect, mongoDisconnect } from '../services/db.js';
import { collectionCreator } from './collection.model';

describe('given a connection with MongoDB', () => {
    const collection = 'testingTasks';
    beforeAll(() => {
        mongoConnect();
    });
    afterAll(() => {
        mongoDisconnect();
    });

    test('then should exist our Model ', () => {
        const Task = collectionCreator(collection);
        expect(Task).toBeTruthy();
        expect(Task.modelName).toBe(collection);
    });
});
