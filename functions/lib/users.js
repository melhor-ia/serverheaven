"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUserCreate = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
const express_1 = __importDefault(require("express"));
const middleware_1 = require("./middleware");
const logger = __importStar(require("firebase-functions/logger"));
admin.initializeApp();
const router = express_1.default.Router();
// GET /users/id/:userId - Get user profile by ID
router.get("/id/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const userDoc = await admin.firestore().collection("users").doc(userId).get();
        if (!userDoc.exists) {
            res.status(404).send({ message: "User not found" });
            return;
        }
        const userData = userDoc.data();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { email, ...publicProfile } = userData;
        res.status(200).send(publicProfile);
    }
    catch (error) {
        logger.error("Error fetching user profile by ID:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
// GET /users/username/:username - Get user profile by username
router.get("/username/:username", async (req, res) => {
    const { username } = req.params;
    try {
        const usersRef = admin.firestore().collection("users");
        const querySnapshot = await usersRef.where("username_lower", "==", username.toLowerCase()).limit(1).get();
        if (querySnapshot.empty) {
            res.status(404).send({ message: "User not found" });
            return;
        }
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { email, ...publicProfile } = userData;
        res.status(200).send(publicProfile);
    }
    catch (error) {
        logger.error("Error fetching user profile by username:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
// GET /users/check-username - Check if a username is available
router.get("/check-username", async (req, res) => {
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
    }
    catch (error) {
        logger.error("Error checking username:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
// GET /users/:userId/posts - Get all posts for a specific user
router.get("/:userId/posts", async (req, res) => {
    const { userId } = req.params;
    try {
        // First, get the author's public information to embed in each post
        const userDoc = await admin.firestore().collection("users").doc(userId).get();
        if (!userDoc.exists) {
            res.status(404).send({ message: "Author not found" });
            return;
        }
        const userData = userDoc.data();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { email, ...authorProfile } = userData;
        const postsRef = admin.firestore().collection("posts");
        const querySnapshot = await postsRef
            .where("author_user_id", "==", userId)
            .where("status", "==", "active")
            .orderBy("created_at", "desc")
            .limit(20)
            .get();
        if (querySnapshot.empty) {
            res.status(200).send([]);
            return;
        }
        // Map posts and embed author info, transforming to match frontend model
        const posts = querySnapshot.docs.map(doc => {
            const postData = doc.data();
            return {
                id: doc.id,
                author: authorProfile,
                content: postData.content,
                likes: postData.like_count || 0,
                commentCount: postData.comment_count || 0,
                createdAt: postData.created_at.toDate(),
                server: postData.author_server_id || null, // Basic server info
                // Fields not on the frontend model are implicitly excluded
            };
        });
        res.status(200).send(posts);
    }
    catch (error) {
        logger.error(`Error fetching posts for user ${userId}:`, error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
// GET /users/search?q=... - Search for users by username for mentions
router.get("/search", async (req, res) => {
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
            const userData = doc.data();
            // Only return data needed for the mentions UI
            return {
                id: userData.id,
                username: userData.username,
                display_name: userData.display_name,
                avatar_url: userData.avatar_url,
            };
        });
        res.status(200).send(users);
    }
    catch (error) {
        logger.error("Error searching for users:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
// PATCH /users - Update user profile
router.patch("/", middleware_1.authenticate, async (req, res) => {
    const userId = req.user?.uid;
    if (!userId) {
        res.status(401).send({ message: "Unauthorized" });
        return;
    }
    const { displayName, bio, avatarUrl, username, tags, coverUrl } = req.body;
    const userProfile = {};
    if (displayName !== undefined)
        userProfile.display_name = displayName;
    if (bio !== undefined)
        userProfile.bio = bio;
    if (avatarUrl !== undefined)
        userProfile.avatar_url = avatarUrl;
    if (coverUrl !== undefined)
        userProfile.cover_url = coverUrl;
    if (tags !== undefined) {
        if (!Array.isArray(tags) || tags.some(t => typeof t !== "string")) {
            res.status(400).send({ message: "Tags must be an array of strings." });
            return;
        }
        if (tags.length > 5) {
            res.status(400).send({ message: "You can have a maximum of 5 tags." });
            return;
        }
        userProfile.tags = tags;
    }
    if (username !== undefined) {
        // Basic validation for username
        if (typeof username !== "string" || username.length < 3 || username.length > 20 || !/^[a-zA-Z0-9_]+$/.test(username)) {
            res.status(400).send({ message: "Username must be 3-20 characters long and can only contain letters, numbers, and underscores." });
            return;
        }
        userProfile.username = username;
        userProfile.username_lower = username.toLowerCase();
    }
    if (Object.keys(userProfile).length === 0) {
        res.status(400).send({ message: "No fields to update" });
        return;
    }
    userProfile.updated_at = firestore_1.FieldValue.serverTimestamp();
    try {
        const authUpdatePayload = {};
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
                    res.status(409).send({ message: "Username is already taken." });
                    return;
                }
            }
        }
        await userRef.update(userProfile);
        const updatedUser = await userRef.get();
        const updatedUserData = updatedUser.data();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { email, ...publicProfile } = updatedUserData;
        res.status(200).send(publicProfile);
    }
    catch (error) {
        logger.error("Error updating user profile:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
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
        created_at: firestore_1.FieldValue.serverTimestamp(),
        updated_at: firestore_1.FieldValue.serverTimestamp(),
        status: "active",
    };
    await admin.firestore().collection("users").doc(uid).set(newUser);
});
exports.default = router;
//# sourceMappingURL=users.js.map