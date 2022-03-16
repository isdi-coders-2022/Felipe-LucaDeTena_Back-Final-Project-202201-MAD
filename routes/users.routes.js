import express from 'express';
import {
    insertUser,
    getUser,
    updateUser,
    deleteUser,
    AddFollowers,
    RemoveFollowers,
} from '../controllers/user.controller.js';
const router = express.Router();

router.post('/', insertUser);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);
router.patch('/followers/:id', RemoveFollowers);
router.patch('/following/:id', AddFollowers);
router.patch('/:id', updateUser);

export default router;
