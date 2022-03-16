import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { createToken } from '../services/auth.js';
import { UserModel } from '../models/user.model.js';
import { CollectionModel } from '../models/collection.model.js';
import pkg from 'express/lib/application.js';

const { all } = pkg;
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
export const AddFollowers = async (req, res, next) => {
    try {
        UserModel.findById(req.params.id).then((user) => {
            if (
                user.followers.some(
                    (follower) => follower.toString() === req.body.id
                )
            ) {
                return res
                    .status(400)
                    .json({ alreadyFollows: 'User  is already followed' });
            } else {
                UserModel.findByIdAndUpdate(req.params.id, {
                    $push: { followers: req.body.id },
                }).then(() => {
                    UserModel.findByIdAndUpdate(req.body.id, {
                        $push: { following: req.params.id },
                    });
                });
            }
        });
    } catch (error) {
        next(error);
    }
};
export const RemoveFollowers = async (req, res, next) => {
    try {
        UserModel.findById(req.params.id).then((user) => {
            if (
                user.followers.some(
                    (follower) => follower.toString() !== req.body.id
                )
            ) {
                return res
                    .status(400)
                    .json({ doesntFollows: 'User is not followed' });
            } else {
                UserModel.findByIdAndUpdate(req.params.id, {
                    $pull: { followers: req.body.id },
                }).then(() => {
                    UserModel.findByIdAndUpdate(req.body.id, {
                        $pull: { following: req.params.id },
                    });
                });
            }
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
        const userData = {
            ...req.body,
            password: encryptedpassword,
            following: tokenContent.id,
            followers: tokenContent.id,
        };
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
