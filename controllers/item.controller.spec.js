import * as controller from './item.controller.js';
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
                req.body = {
                    _id: '6230bac67ccc9d51abeb6abe',
                    img: 'https://firebasestorage.googleapis.com/v0/b/wishy-c9ec8.appspot.com/o/17105314_35421861_600.png?alt=media&token=de189b65-2f50-4788-87c9-ef76b651c07b',
                    shopUrl:
                        'https://www.farfetch.com/ca/shopping/women/marni-cropped-leg-culottes-item-17105314.aspx?storeid=10050',
                    price: 753,
                    category: 'trousers',
                    brand: 'Marni',
                };

                ItemModel.create.mockReturnValue({
                    _id: '6230bac67ccc9d51abeb6abe',
                    img: 'https://firebasestorage.googleapis.com/v0/b/wishy-c9ec8.appspot.com/o/17105314_35421861_600.png?alt=media&token=de189b65-2f50-4788-87c9-ef76b651c07b',
                    shopUrl:
                        'https://www.farfetch.com/ca/shopping/women/marni-cropped-leg-culottes-item-17105314.aspx?storeid=10050',
                    price: 753,
                    category: 'trousers',
                    brand: 'Marni',
                });
            });
            test('Then call json', async () => {
                await controller.insertItem(req, res, next);
                expect(res.json).toHaveBeenCalledWith({
                    _id: '6230bac67ccc9d51abeb6abe',
                    img: 'https://firebasestorage.googleapis.com/v0/b/wishy-c9ec8.appspot.com/o/17105314_35421861_600.png?alt=media&token=de189b65-2f50-4788-87c9-ef76b651c07b',
                    shopUrl:
                        'https://www.farfetch.com/ca/shopping/women/marni-cropped-leg-culottes-item-17105314.aspx?storeid=10050',
                    price: 753,
                    category: 'trousers',
                    brand: 'Marni',
                });
            });
        });
        describe('And it doesnt work (promise is rejected)', () => {
            beforeEach(() => {
                req.body = {
                    _id: '6230bac67ccc9d51abeb6abe',
                    img: 'https://firebasestorage.googleapis.com/v0/b/wishy-c9ec8.appspot.com/o/17105314_35421861_600.png?alt=media&token=de189b65-2f50-4788-87c9-ef76b651c07b',
                    shopUrl:
                        'https://www.farfetch.com/ca/shopping/women/marni-cropped-leg-culottes-item-17105314.aspx?storeid=10050',
                    price: 753,
                    category: 'trousers',
                    brand: 'Marni',
                };
                ItemModel.create.mockRejectedValue(
                    new Error('Error adding Item')
                );
            });
            test('Then call next', async () => {
                await controller.insertItem(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });
});
