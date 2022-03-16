import { mongoConnect, mongoDisconnect } from '../services/db.js';
import { collectionCreator } from './collection.model';

describe('given a connection with MongoDB', () => {
    const collection = 'testingCollections';
    beforeAll(() => {
        mongoConnect();
    });
    afterAll(() => {
        mongoDisconnect();
    });

    test('then should exist our Model ', () => {
        const Collection = collectionCreator(collection);
        expect(Collection).toBeTruthy();
        expect(Collection.modelName).toBe(collection);
    });
});
