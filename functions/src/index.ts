import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import express, {Request, Response} from "express";
import cors from "cors";
import {authenticate, AuthenticatedRequest} from "./middleware";
import { FieldValue } from "firebase-admin/firestore";

admin.initializeApp();

interface UserDocument {
    id: string;
    username: string;
    display_name: string;
    email: string;
    avatar_url: string;
    bio: string;
    reputation_score: number;
    is_supporter: boolean;
    supporter_since: admin.firestore.Timestamp | null;
    created_at: admin.firestore.Timestamp;
    updated_at: admin.firestore.Timestamp;
    status: "active" | "suspended" | "banned";
}

const app = express();
app.use(express.json());
app.use(cors({origin: true}));

app.get("/", (req: Request, res: Response) => {
    logger.info("Hello from the backend!", {structuredData: true});
    res.status(200).send({
        message: "Hello from the backend api!",
    });
});

app.get("/profile/:userId", async (req: Request, res: Response) => {
    const {userId} = req.params;

    try {
        const userDoc = await admin.firestore().collection("users").doc(userId).get();

        if (!userDoc.exists) {
            res.status(404).send({message: "User not found"});
            return;
        }

        const userData = userDoc.data() as UserDocument;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {email, ...publicProfile} = userData;

        res.status(200).send(publicProfile);
    } catch (error) {
        logger.error("Error fetching user profile:", error);
        res.status(500).send({message: "Internal Server Error"});
    }
});

app.patch("/profile", authenticate, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.uid;
    if (!userId) {
        res.status(401).send({message: "Unauthorized"});
        return;
    }

    const {displayName, bio, avatarUrl} = req.body;

    const userProfile: {[key: string]: any} = {};
    if (displayName !== undefined) userProfile.display_name = displayName;
    if (bio !== undefined) userProfile.bio = bio;
    if (avatarUrl !== undefined) userProfile.avatar_url = avatarUrl;

    if (Object.keys(userProfile).length === 0) {
        res.status(400).send({message: "No fields to update"});
        return;
    }

    userProfile.updated_at = FieldValue.serverTimestamp();

    try {
        const userRef = admin.firestore().collection("users").doc(userId);
        await userRef.update(userProfile);

        const updatedUser = await userRef.get();
        const updatedUserData = updatedUser.data() as UserDocument;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {email, ...publicProfile} = updatedUserData;


        res.status(200).send(publicProfile);
    } catch (error) {
        logger.error("Error updating user profile:", error);
        res.status(500).send({message: "Internal Server Error"});
    }
});

export * from "./users";
export const api = onRequest(app); 