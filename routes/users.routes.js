import express from 'express';
import {
    insertUser,
    getUser,
    updateUser,
    deleteUser,
} from '../controllers/user.controller.js';
const router = express.Router();

router.post('/', insertUser);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);
router.patch('/:id', updateUser);
export default router;
