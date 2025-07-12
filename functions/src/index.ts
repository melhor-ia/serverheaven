import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import express, {Request, Response} from "express";
import cors from "cors";
import usersRouter, { onUserCreate } from "./users";
import serversRouter from "./servers";
import reviewsRouter, { onReviewCreate } from "./reviews";
import postsRouter from "./posts";
import { seedDatabase } from "./seed";

if (admin.apps.length === 0) {
    admin.initializeApp();
    admin.firestore().settings({ ignoreUndefinedProperties: true });
}

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

// Middleware to adapt callable requests to Express
app.use((req: any, res, next) => {
    // Check if the request is from a callable function
    if (req.body.data && req.body.data.route) {
        // Here we are adapting the request to make it look like a normal HTTP request
        console.log(`Callable request detected for route: ${req.body.data.route}`);
        req.method = req.body.data.method || 'POST'; // Default to POST if not specified
        req.url = `/${req.body.data.route}`;
        req.body = req.body.data.data || {}; // The actual payload for the request
        console.log(`Rewriting to ${req.method} ${req.url}`);
    }
    next();
});

app.get("/", (req: Request, res: Response) => {
    logger.info("Hello from the backend!", {structuredData: true});
    res.status(200).send({
        message: "Hello from the backend api!",
    });
});

app.use("/users", usersRouter);
app.use("/servers", serversRouter);
app.use("/reviews", reviewsRouter);
app.use("/posts", postsRouter);

app.post("/seed", async (req, res) => {
    try {
        const result = await seedDatabase();
        res.status(200).send(result);
    } catch (error) {
        console.error("Error seeding database:", error);
        res.status(500).send({ success: false, message: "Failed to seed database." });
    }
});

export { onUserCreate, onReviewCreate };
export * from "./servers";
export * from "./reviews";
export * from "./posts";
export * from "./beta";
export const api = onRequest(app);