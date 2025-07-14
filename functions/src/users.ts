import * as functions from "firebase-functions/v1";
import {auth} from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import express, { Request, Response } from "express";
import { authenticate, AuthenticatedRequest } from "./middleware";
import * as logger from "firebase-functions/logger";

if (admin.apps.length === 0) {
    admin.initializeApp();
}

interface UserDocument {
    id: string;
    username: string;
    username_lower: string; // For case-insensitive queries
    display_name: string;
    email: string;
    avatar_url: string;
    cover_url: string;
    bio: string;
    tags: string[];
    rating: {
        average: number;
        count: number;
    };
    is_supporter: boolean;
    supporter_since: admin.firestore.Timestamp | null;
    created_at: admin.firestore.Timestamp;
    updated_at: admin.firestore.Timestamp;
    status: "active" | "suspended" | "banned";
}

const router = express.Router();

// GET /users/profile/:userId - Get user profile
router.get("/profile/:userId", async (req: Request, res: Response) => {
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

// PATCH /users/profile - Update user profile
router.patch("/profile", authenticate, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.uid;
    if (!userId) {
        res.status(401).send({message: "Unauthorized"});
        return;
    }

    const {displayName, bio, avatarUrl, username, tags, coverUrl} = req.body;

    const userProfile: {[key: string]: any} = {};
    if (displayName !== undefined) userProfile.display_name = displayName;
    if (bio !== undefined) userProfile.bio = bio;
    if (avatarUrl !== undefined) userProfile.avatar_url = avatarUrl;
    if (coverUrl !== undefined) userProfile.cover_url = coverUrl;
    if (tags !== undefined) {
        if (!Array.isArray(tags) || tags.some(t => typeof t !== "string")) {
            res.status(400).send({message: "Tags must be an array of strings."});
            return;
        }
        if (tags.length > 5) {
            res.status(400).send({message: "You can have a maximum of 5 tags."});
            return;
        }
        userProfile.tags = tags;
    }
    if (username !== undefined) {
        // Basic validation for username
        if (typeof username !== "string" || username.length < 3 || username.length > 20 || !/^[a-zA-Z0-9_]+$/.test(username)) {
            res.status(400).send({message: "Username must be 3-20 characters long and can only contain letters, numbers, and underscores."});
            return;
        }
        userProfile.username = username;
        userProfile.username_lower = username.toLowerCase();
    }


    if (Object.keys(userProfile).length === 0) {
        res.status(400).send({message: "No fields to update"});
        return;
    }

    userProfile.updated_at = FieldValue.serverTimestamp();

    try {
        const userRef = admin.firestore().collection("users").doc(userId);

        // If username is being changed, check for uniqueness
        if (userProfile.username_lower) {
            const usernameQuery = await admin.firestore().collection("users")
                .where("username_lower", "==", userProfile.username_lower)
                .limit(1)
                .get();

            if (!usernameQuery.empty) {
                const existingUser = usernameQuery.docs[0];
                if (existingUser.id !== userId) {
                    res.status(409).send({message: "Username is already taken."});
                    return;
                }
            }
        }

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


export const onUserCreate = functions.auth.user().onCreate(async (user: auth.UserRecord) => {
    const { uid, email } = user;
    const username = email?.split("@")[0] || uid;

    const newUser = {
        id: uid,
        username: username,
        username_lower: username.toLowerCase(),
        display_name: username,
        email: email || "",
        avatar_url: "",
        cover_url: "",
        bio: "",
        tags: [],
        rating: {
            average: 0,
            count: 0,
        },
        is_supporter: false,
        supporter_since: null,
        created_at: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp(),
        status: "active",
    };

    await admin.firestore().collection("users").doc(uid).set(newUser);
});

export default router; 