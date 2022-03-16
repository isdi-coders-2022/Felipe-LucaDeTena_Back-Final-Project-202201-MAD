import express from 'express';
import {
    getCollection,
    getAllCollections,
    insertCollection,
    updateCollection,
    deleteCollection,
} from '../controllers/collection.controller.js';

import { loginRequired, userRequired } from '../middlewares/interceptors.js';
const router = express.Router();

router.get('/', getAllCollections);
router.get('/:id', getCollection);
router.post('/', insertCollection, loginRequired, userRequired);
router.delete('/:id', deleteCollection, loginRequired, userRequired);
router.patch('/:id', updateCollection, loginRequired, userRequired);
export default router;
