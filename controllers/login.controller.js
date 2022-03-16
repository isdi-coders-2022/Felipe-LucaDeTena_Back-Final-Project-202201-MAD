import { createToken } from '../services/auth.js';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model.js';

export const login = async (req, resp, next) => {
    const user = req.body;
    const loginError = new Error('user or password invalid');
    loginError.status = 401;
    if (!user.name || !user.password) {
        next(loginError);
    } else {
        const userFound = await UserModel.findOne({
            name: user.name,
        });
        if (!userFound) {
            next(loginError);
        } else if (!bcrypt.compareSync(user.password, userFound.password)) {
            next(loginError);
        } else {
            const token = createToken({
                name: userFound.name,
                id: userFound.id,
            });
            resp.json({
                token,
                name: userFound.name,
                id: userFound.id,
            });
        }
    }
};
