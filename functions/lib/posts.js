"use strict";
// Implementa /purpleStone/Sistema de Posts e Feed.md
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
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const firestore_1 = require("firebase-admin/firestore");
const middleware_1 = require("./middleware");
const router = express.Router();
const db = (0, firestore_1.getFirestore)();
// POST /posts - Create a new post
router.post("/", middleware_1.authenticate, async (req, res) => {
    try {
        const userId = req.user?.uid;
        if (!userId) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        const { author_server_id, content, media_urls, tags, type } = req.body;
        if (!content || !type) {
            res.status(400).send({ message: "Missing required fields: content, type" });
            return;
        }
        // Validate that either user or server is the author
        if (!author_server_id) {
            // If no server author, user must be the author.
            // In a more complex scenario, you might check if the user is posting on behalf of a server they admin.
        }
        else {
            // If server is author, check if user has rights to post for the server
            const serverDoc = await db.collection("servers").doc(author_server_id).get();
            if (!serverDoc.exists) {
                res.status(404).send({ message: "Server not found" });
                return;
            }
            const serverData = serverDoc.data();
            if (!serverData?.admins.includes(userId)) {
                res.status(403).send({ message: "Forbidden: You do not have permission to post for this server." });
                return;
            }
        }
        const newPostRef = db.collection("posts").doc();
        const postData = {
            id: newPostRef.id,
            content,
            media_urls: media_urls || [],
            tags: tags || [],
            type,
            status: 'active',
            like_count: 0,
            comment_count: 0,
        };
        if (author_server_id) {
            postData.author_server_id = author_server_id;
        }
        else {
            postData.author_user_id = userId;
        }
        await newPostRef.set({
            ...postData,
            created_at: firestore_1.FieldValue.serverTimestamp(),
            updated_at: firestore_1.FieldValue.serverTimestamp(),
        });
        const newPostDoc = await newPostRef.get();
        res.status(201).send({ data: newPostDoc.data() });
    }
    catch (error) {
        console.error("Error creating post:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
// GET /posts/:postId - Get post details
router.get("/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        const postDoc = await db.collection("posts").doc(postId).get();
        if (!postDoc.exists) {
            res.status(404).send({ message: "Post not found" });
            return;
        }
        res.status(200).send({ data: postDoc.data() });
    }
    catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
// GET /posts - Get all posts (simplified feed)
router.get("/", async (req, res) => {
    try {
        const postsSnapshot = await db.collection("posts")
            .where('status', '==', 'active')
            .orderBy("created_at", "desc")
            .limit(20) // Keep a reasonable limit
            .get();
        if (postsSnapshot.empty) {
            res.status(200).send({ data: [] });
            return;
        }
        // Gather author IDs to fetch their data
        const userIds = new Set();
        const serverIds = new Set();
        postsSnapshot.docs.forEach(doc => {
            const post = doc.data();
            if (post.author_user_id) {
                userIds.add(post.author_user_id);
            }
            if (post.author_server_id) {
                serverIds.add(post.author_server_id);
            }
        });
        // Fetch author data in parallel
        const authors = {};
        const userPromises = userIds.size > 0 ?
            db.collection("users").where(firestore_1.FieldPath.documentId(), 'in', Array.from(userIds)).get() :
            Promise.resolve(null);
        const serverPromises = serverIds.size > 0 ?
            db.collection("servers").where(firestore_1.FieldPath.documentId(), 'in', Array.from(serverIds)).get() :
            Promise.resolve(null);
        const [usersSnapshot, serversSnapshot] = await Promise.all([userPromises, serverPromises]);
        if (usersSnapshot) {
            usersSnapshot.forEach(userDoc => {
                if (userDoc.exists) {
                    const { email, ...publicProfile } = userDoc.data();
                    authors[userDoc.id] = { ...publicProfile, type: 'user' };
                }
            });
        }
        if (serversSnapshot) {
            serversSnapshot.forEach(serverDoc => {
                if (serverDoc.exists) {
                    authors[serverDoc.id] = { ...serverDoc.data(), type: 'server' };
                }
            });
        }
        // Map posts and embed author info
        const posts = postsSnapshot.docs.map(doc => {
            const postData = doc.data();
            const authorId = postData.author_user_id || postData.author_server_id;
            const author = authorId ? authors[authorId] : null;
            return {
                id: doc.id,
                author: author,
                content: postData.content,
                likes: postData.like_count || 0,
                commentCount: postData.comment_count || 0,
                createdAt: postData.created_at.toDate(),
                server: postData.author_server_id || null // Keep this for now for client compatibility
            };
        });
        res.status(200).send({ data: posts });
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
// POST /posts/:postId/like - Like or unlike a post
router.post("/:postId/like", middleware_1.authenticate, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user?.uid;
        if (!userId) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        const postRef = db.collection("posts").doc(postId);
        const likeRef = postRef.collection("interactions").doc(`${userId}_like`);
        await db.runTransaction(async (transaction) => {
            const postDoc = await transaction.get(postRef);
            if (!postDoc.exists) {
                throw new Error("Post not found");
            }
            const likeDoc = await transaction.get(likeRef);
            if (likeDoc.exists) {
                // Unlike
                transaction.delete(likeRef);
                transaction.update(postRef, { like_count: firestore_1.FieldValue.increment(-1) });
                res.status(200).send({ data: { message: "Post unliked successfully" } });
            }
            else {
                // Like
                const likeData = {
                    id: likeRef.id,
                    post_id: postId,
                    user_id: userId,
                    type: 'like',
                };
                transaction.set(likeRef, {
                    ...likeData,
                    created_at: firestore_1.FieldValue.serverTimestamp()
                });
                transaction.update(postRef, { like_count: firestore_1.FieldValue.increment(1) });
                res.status(201).send({ data: { message: "Post liked successfully" } });
            }
        });
    }
    catch (error) {
        console.error("Error liking post:", error);
        if (error.message === "Post not found") {
            res.status(404).send({ message: "Post not found" });
        }
        else {
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
});
// POST /posts/:postId/comment - Comment on a post
router.post("/:postId/comment", middleware_1.authenticate, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user?.uid;
        const { content } = req.body;
        if (!userId) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        if (!content) {
            res.status(400).send({ message: "Missing required field: content" });
            return;
        }
        const postRef = db.collection("posts").doc(postId);
        const commentRef = postRef.collection("interactions").doc(); // New doc for each comment
        await db.runTransaction(async (transaction) => {
            const postDoc = await transaction.get(postRef);
            if (!postDoc.exists) {
                throw new Error("Post not found");
            }
            const commentData = {
                id: commentRef.id,
                post_id: postId,
                user_id: userId,
                type: 'comment',
                content: content,
            };
            transaction.set(commentRef, {
                ...commentData,
                created_at: firestore_1.FieldValue.serverTimestamp()
            });
            transaction.update(postRef, { comment_count: firestore_1.FieldValue.increment(1) });
        });
        const newComment = (await commentRef.get()).data();
        res.status(201).send({ data: newComment });
    }
    catch (error) {
        console.error("Error commenting on post:", error);
        if (error.message === "Post not found") {
            res.status(404).send({ message: "Post not found" });
        }
        else {
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
});
exports.default = router;
//# sourceMappingURL=posts.js.map