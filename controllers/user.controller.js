import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { createToken } from '../services/auth.js';
import { UserModel } from '../models/user.model.js';

dotenv.config();

export const getUser = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.params.id);
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        await UserModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).then((resp) => {
            res.json(resp);
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        await UserModel.findByIdAndDelete(req.params.id).then((resp) => {
            res.json(resp);
        });
    } catch (error) {
        next(error);
    }
};

export const insertUser = async (req, resp, next) => {
    try {
        const encryptedpassword = await bcrypt.hashSync(req.body.password);
        const userData = { ...req.body, passwordd: encryptedpassword };
        const result = await UserModel.create(userData);
        const token = createToken({
            name: result.name,
            id: result.id,
        });
        resp.json({
            token,
            name: result.name,
            id: result.id,
        });
    } catch (error) {
        next(error);
    }
};
