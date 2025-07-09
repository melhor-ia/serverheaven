import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import express, {Request, Response} from "express";
import cors from "cors";
import usersRouter, { onUserCreate } from "./users";
import serversRouter from "./servers";

if (admin.apps.length === 0) {
    admin.initializeApp();
}

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    logger.info("Hello from the backend!", {structuredData: true});
    res.status(200).send({
        message: "Hello from the backend api!",
    });
});

app.use("/users", usersRouter);
app.use("/servers", serversRouter);

export { onUserCreate };
export const api = onRequest(app); 