import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import AuthManager from "../services/AuthManager";

class AuthMiddleware extends AuthManager {

    public authenticate = (req: Request, res: Response, next: NextFunction) => {

        const token = req.header('Authorization');

        if(!token) {
            return res.status(401).json({ message: 'Unauthorized: Missing jwt token'})
        }

        jwt.verify(token, AuthManager.secretKey, (err, payload) => {
            if( err ) {
                return res.status(401).json({ message: 'Unauthorized: Ivalid token'});
            }

            next();
        })
    }


}

export default new AuthMiddleware();