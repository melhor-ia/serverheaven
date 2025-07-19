import * as functions from "firebase-functions/v1";
import {auth} from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import express, { Request, Response } from "express";
import { authenticate, AuthenticatedRequest } from "./middleware";
import * as logger from "firebase-functions/logger";

admin.initializeApp();

export interface UserDocument {
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

// eslint-disable-next-line require-jsdoc
export const preparePublicProfile = (userData: UserDocument) => {
  const profileWithSerializableDates: any = { ...userData };

  // Convert all Timestamp fields to ISO strings so they can be
  // correctly parsed by the client-side `new Date()` constructor.
  if (userData.created_at && typeof userData.created_at.toDate === "function") {
    profileWithSerializableDates.created_at = userData.created_at.toDate().toISOString();
  }
  if (userData.updated_at && typeof userData.updated_at.toDate === "function") {
    profileWithSerializableDates.updated_at = userData.updated_at.toDate().toISOString();
  }
  if (userData.supporter_since && typeof userData.supporter_since.toDate === "function") {
    profileWithSerializableDates.supporter_since = userData.supporter_since.toDate().toISOString();
  }

  // The 'email' property is sensitive and should not be sent to the client.
  // We explicitly delete it from the object before sending.
  delete profileWithSerializableDates.email;

  return profileWithSerializableDates;
};

const router = express.Router();

// GET /users/id/:userId - Get user profile by ID
router.get("/id/:userId", async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const userDoc = await admin.firestore().collection("users").doc(userId).get();

        if (!userDoc.exists) {
            res.status(404).send({ message: "User not found" });
            return;
        }

        const userData = userDoc.data() as UserDocument;
        const publicProfile = preparePublicProfile(userData);
        res.status(200).send(publicProfile);
    } catch (error) {
        logger.error("Error fetching user profile by ID:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// GET /users/username/:username - Get user profile by username
router.get("/username/:username", async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
        const usersRef = admin.firestore().collection("users");
        const querySnapshot = await usersRef.where("username_lower", "==", username.toLowerCase()).limit(1).get();

        if (querySnapshot.empty) {
            res.status(404).send({ message: "User not found" });
            return;
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data() as UserDocument;
        const publicProfile = preparePublicProfile(userData);
        res.status(200).send(publicProfile);
    } catch (error) {
        logger.error("Error fetching user profile by username:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// GET /users/check-username - Check if a username is available
router.get("/check-username", async (req: Request, res: Response) => {
    const { username } = req.query;

    if (typeof username !== "string" || username.length < 3) {
        res.status(400).send({ message: "Invalid username." });
        return;
    }

    try {
        const usernameLower = username.toLowerCase();
        const usernameQuery = await admin.firestore().collection("users")
            .where("username_lower", "==", usernameLower)
            .limit(1)
            .get();

        res.status(200).send({ isAvailable: usernameQuery.empty });
    } catch (error) {
        logger.error("Error checking username:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// GET /api/users/:userId/posts - Get all posts by a specific user
router.get("/:userId/posts", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const postsSnapshot = await admin.firestore().collection("posts")
            .where("author_user_id", "==", userId)
            .where('status', '==', 'active')
            .orderBy("created_at", "desc")
            .get();

        if (postsSnapshot.empty) {
            res.status(200).json([]);
            return;
        }

        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        if (!userDoc.exists) {
            // This case should be rare if posts exist, but good to handle.
            res.status(404).json({ message: 'Author not found' });
            return;
        }
        const authorData = preparePublicProfile(userDoc.data() as UserDocument);
        const author = { ...authorData, type: 'user' };


        const posts = postsSnapshot.docs.map(doc => {
            const postData = doc.data() as any; // Firestore data
            return {
                id: doc.id,
                content: postData.content,
                likes: postData.like_count || 0,
                commentCount: postData.comment_count || 0,
                createdAt: postData.created_at.toDate(),
                author: author, // Embed the author data
            };
        });

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


// GET /users/search - Search for users
router.get("/search", async (req: Request, res: Response) => {
    const { q } = req.query;

    if (typeof q !== "string" || q.length < 1) {
        res.status(400).send({ message: "Search query must be at least 1 character long." });
        return;
    }

    try {
        const queryLower = q.toLowerCase();
        // Firestore doesn't support native "starts with" queries.
        // This is a common workaround using a range query on an all-lowercase field.
        const usersRef = admin.firestore().collection("users");
        const querySnapshot = await usersRef
            .where("username_lower", ">=", queryLower)
            .where("username_lower", "<=", queryLower + '\uf8ff')
            .limit(10) // Limit results for performance
            .get();

        if (querySnapshot.empty) {
            res.status(200).send([]);
            return;
        }

        const users = querySnapshot.docs.map(doc => {
            const userData = doc.data() as UserDocument;
            // Only return data needed for the mentions UI
            return {
                id: userData.id,
                username: userData.username,
                display_name: userData.display_name,
                avatar_url: userData.avatar_url,
            };
        });

        res.status(200).send(users);
    } catch (error) {
        logger.error("Error searching for users:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


// PATCH /users - Update user profile
router.patch("/", authenticate, async (req: AuthenticatedRequest, res: Response) => {
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
        const authUpdatePayload: { displayName?: string; photoURL?: string } = {};
        if (userProfile.display_name) {
            authUpdatePayload.displayName = userProfile.display_name;
        }
        if (userProfile.avatar_url) {
            authUpdatePayload.photoURL = userProfile.avatar_url;
        }

        // Only update auth if there's something to update
        if (Object.keys(authUpdatePayload).length > 0) {
            await admin.auth().updateUser(userId, authUpdatePayload);
        }

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