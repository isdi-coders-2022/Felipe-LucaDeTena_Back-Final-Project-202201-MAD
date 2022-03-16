import express from 'express';
import {
    getItem,
    getAllItems,
    insertItem,
    updateItem,
    deleteItem,
} from '../controllers/item.controller.js';

const router = express.Router();

router.post('/', insertItem);
router.get('/:id', getItem);
router.get('/', getAllItems);
router.delete('/:id', deleteItem);
router.patch('/:id', updateItem);
export default router;
