import { createToken } from '../services/auth.js';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model.js';

export const login = async (req, resp, next) => {
    const user = req.body;
    const loginError = new Error('user or password invalid');
    console.log(1);
    loginError.status = 401;
    if (!user.email || !user.password) {
        console.log(2);
        next(loginError);
    } else {
        const userFound = await UserModel.findOne({
            email: user.email,
        }).populate('collections');
        if (!userFound) {
            console.log(3);
            next(loginError);
        } else if (!bcrypt.compareSync(user.password, userFound.password)) {
            console.log(4);
            next(loginError);
        } else {
            console.log(5);
            const token = createToken({
                email: userFound.email,
                id: userFound.id,
            });
            resp.json({
                token,
                email: userFound.email,
                id: userFound.id,
                profileImg: userFound.profileImg,
                backImg: userFound.backImg,
                interFaceColor: userFound.interFaceColor,
                collections: userFound.collections,
                followers: userFound.followers,
                following: userFound.following,
                name: userFound.name,
                surName: userFound.surName,
            });
        }
    }
};
