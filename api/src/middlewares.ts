import { NextFunction, Request, Response } from "express";
import { decodeToken } from "./shared/utils/decode-token";

export const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(422).send('Not authorized');
    }

    try {
        await decodeToken(token);
        return next();
    } catch(err) {
        return res.status(422).send('Invalid token');
    }
};
