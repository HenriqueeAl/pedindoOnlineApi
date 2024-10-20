import { NextFunction, Request, Response } from "express";

const jwt = require('jsonwebtoken');

export const verifyLogin = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send('Token inválido.');

    jwt.verify(token, process.env.JWTTOKEN, (err: any, user: any) => {
        if (err) return res.status(403).send('Token inválido.');
    
        req.user = user;
        next()
    });
}