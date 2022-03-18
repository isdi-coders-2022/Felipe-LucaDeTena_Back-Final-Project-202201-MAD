import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { createToken } from '../services/auth.js';
import { UserModel } from '../models/user.model.js';

dotenv.config();

export const getUser = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.params.id)
            .populate('followers')
            .populate('following')
            .populate('collections');
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = (req, res, next) => {
    return UserModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })
        .then((resp) => {
            res.json(resp);
        })
        .catch((error) => next(error));
};

export const AddFollowers = async (req, res, next) => {
    try {
        const userFollowing = await UserModel.findById(req.params.id);

        if (
            userFollowing.followers.some(
                (follower) => follower.toString() === req.body.id
            )
        ) {
            return res
                .status(400)
                .json({ alreadyFollows: 'User  is already followed' });
        } else {
            userFollowing.followers.push(req.body.id);
            await userFollowing.save();

            const userFollower = await UserModel.findById(req.body.id);
            userFollower.following.push(req.params.id);
            await userFollower.save();

            res.json(userFollowing);
        }
    } catch (error) {
        next(error);
    }
};
export const RemoveFollowers = async (req, res, next) => {
    console.log(1);
    try {
        const userFollowing = await UserModel.findById(req.params.id);
        if (
            userFollowing.followers.some(
                (follower) => follower.toString() !== req.body.id
            )
        ) {
            console.log(2);
            return res
                .status(400)
                .json({ doesntFollows: 'User is not followed' });
        } else {
            console.log(3);
            const userFollower = await UserModel.findByIdAndUpdate(
                req.params.id,
                {
                    $pull: { followers: req.body.id },
                },
                { new: true }
            );
            userFollower.UserModel.findByIdAndUpdate(
                req.body.id,
                {
                    $pull: { following: req.params.id },
                },
                { new: true }
            );
            res.json(userFollowing);
        }
    } catch (error) {
        console.log('ahora', error);
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
        console.log(error);
        next(error);
    }
};
