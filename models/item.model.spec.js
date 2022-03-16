import { mongoConnect, mongoDisconnect } from '../services/db.js';
import { itemCreator } from './item.model';

describe('given a connection with MongoDB', () => {
    const item = 'testingItems';
    beforeAll(() => {
        mongoConnect();
    });
    afterAll(() => {
        mongoDisconnect();
    });

    test('then should exist our Model ', () => {
        const Item = itemCreator(item);
        expect(Item).toBeTruthy();
        expect(Item.modelName).toBe(item);
    });
});
