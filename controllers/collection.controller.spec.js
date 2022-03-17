import * as controller from './collection.controller.js';
import { CollectionModel } from '../models/collection.model.js';

jest.mock('../models/Collection.model.js');
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
                req.body = {
                    name: 'Goth girl 3',
                    totalPrice: '2766',
                    createdBY: 'emanuelle',
                    items: [
                        {
                            _id: '6230bac67ccc9d51abeb6abe',
                            img: 'https://firebasestorage.googleapis.com/v0/b/wishy-c9ec8.appspot.com/o/17105314_35421861_600.png?alt=media&token=de189b65-2f50-4788-87c9-ef76b651c07b',
                            shopUrl:
                                'https://www.farfetch.com/ca/shopping/women/marni-cropped-leg-culottes-item-17105314.aspx?storeid=10050',
                            price: 753,
                            category: 'trousers',
                            brand: 'Marni',
                        },
                    ],
                    favourite: true,
                    likes: 250,
                };

                CollectionModel.create.mockReturnValue({
                    name: 'Goth girl 3',
                    totalPrice: '2766',
                    createdBY: 'emanuelle',
                    items: [
                        {
                            _id: '6230bac67ccc9d51abeb6abe',
                            img: 'https://firebasestorage.googleapis.com/v0/b/wishy-c9ec8.appspot.com/o/17105314_35421861_600.png?alt=media&token=de189b65-2f50-4788-87c9-ef76b651c07b',
                            shopUrl:
                                'https://www.farfetch.com/ca/shopping/women/marni-cropped-leg-culottes-item-17105314.aspx?storeid=10050',
                            price: 753,
                            category: 'trousers',
                            brand: 'Marni',
                        },
                    ],
                    favourite: true,
                    likes: 250,
                });
            });
            test('Then call json', async () => {
                await controller.insertCollection(req, res, next);
                expect(res.json).toHaveBeenCalledWith({
                    name: 'Goth girl 3',
                    totalPrice: '2766',
                    createdBY: 'emanuelle',
                    items: [
                        {
                            _id: '6230bac67ccc9d51abeb6abe',
                            img: 'https://firebasestorage.googleapis.com/v0/b/wishy-c9ec8.appspot.com/o/17105314_35421861_600.png?alt=media&token=de189b65-2f50-4788-87c9-ef76b651c07b',
                            shopUrl:
                                'https://www.farfetch.com/ca/shopping/women/marni-cropped-leg-culottes-item-17105314.aspx?storeid=10050',
                            price: 753,
                            category: 'trousers',
                            brand: 'Marni',
                        },
                    ],
                    favourite: true,
                    likes: 250,
                });
            });
        });
        describe('And it doesnt work (promise is rejected)', () => {
            beforeEach(() => {
                req.body = {
                    name: 'Goth girl 3',
                    totalPrice: '2766',
                    createdBY: 'emanuelle',
                    items: [
                        {
                            _id: '6230bac67ccc9d51abeb6abe',
                            img: 'https://firebasestorage.googleapis.com/v0/b/wishy-c9ec8.appspot.com/o/17105314_35421861_600.png?alt=media&token=de189b65-2f50-4788-87c9-ef76b651c07b',
                            shopUrl:
                                'https://www.farfetch.com/ca/shopping/women/marni-cropped-leg-culottes-item-17105314.aspx?storeid=10050',
                            price: 753,
                            category: 'trousers',
                            brand: 'Marni',
                        },
                    ],
                    favourite: true,
                    likes: 250,
                };
                CollectionModel.create.mockRejectedValue(
                    new Error('Error adding Collection')
                );
            });
            test('Then call next', async () => {
                await controller.insertCollection(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });
});
