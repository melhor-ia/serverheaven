import {Request, Response, NextFunction} from "express";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

export interface AuthenticatedRequest extends Request {
    user?: admin.auth.DecodedIdToken;
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const {authorization} = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        res.status(401).send({message: "Unauthorized: Missing or invalid token"});
        return;
    }

    const idToken = authorization.split("Bearer ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        logger.error("Error while verifying Firebase ID token:", error);
        res.status(403).send({message: "Forbidden: Invalid token"});
    }
}; 