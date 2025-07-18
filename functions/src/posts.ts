// Implementa /purpleStone/Sistema de Posts e Feed.md

import * as express from "express";
import { getFirestore, FieldValue, FieldPath } from "firebase-admin/firestore";
import { authenticate, AuthenticatedRequest } from "./middleware";

// Based on /purpleStone/_legacy/Modelagem de Dados.md
interface Post {
    id: string;
    author_user_id?: string;
    author_server_id?: string;
    content: string;
    media_urls: string[];
    tags: string[];
    created_at: FirebaseFirestore.Timestamp;
    updated_at: FirebaseFirestore.Timestamp;
    status: 'active' | 'flagged' | 'removed';
    type: 'update' | 'event' | 'recruitment' | 'media';
    like_count: number;
    comment_count: number;
}

interface Interaction {
    id: string;
    post_id: string;
    user_id: string;
    type: 'like' | 'comment';
    content?: string;
    created_at: FirebaseFirestore.Timestamp;
}

const router = express.Router();
const db = getFirestore();

// POST /posts - Create a new post
router.post("/", authenticate, async (req: AuthenticatedRequest, res) => {
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
        } else {
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
        const postData: Omit<Post, "created_at" | "updated_at"> = {
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
        } else {
            postData.author_user_id = userId;
        }


        await newPostRef.set({
            ...postData,
            created_at: FieldValue.serverTimestamp(),
            updated_at: FieldValue.serverTimestamp(),
        });

        const newPostDoc = await newPostRef.get();
        res.status(201).send({ data: newPostDoc.data() });
    } catch (error) {
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
    } catch (error) {
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
        const userIds = new Set<string>();
        const serverIds = new Set<string>();
        postsSnapshot.docs.forEach(doc => {
            const post = doc.data() as Post;
            if (post.author_user_id) {
                userIds.add(post.author_user_id);
            }
            if (post.author_server_id) {
                serverIds.add(post.author_server_id);
            }
        });

        // Fetch author data in parallel
        const authors: { [key: string]: any } = {};

        const userPromises = userIds.size > 0 ?
            db.collection("users").where(FieldPath.documentId(), 'in', Array.from(userIds)).get() :
            Promise.resolve(null);

        const serverPromises = serverIds.size > 0 ?
            db.collection("servers").where(FieldPath.documentId(), 'in', Array.from(serverIds)).get() :
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
            const postData = doc.data() as Post;
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
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// POST /posts/:postId/like - Like or unlike a post
router.post("/:postId/like", authenticate, async (req: AuthenticatedRequest, res) => {
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
                transaction.update(postRef, { like_count: FieldValue.increment(-1) });
                res.status(200).send({ data: { message: "Post unliked successfully" } });
            } else {
                // Like
                const likeData: Omit<Interaction, "created_at"> = {
                    id: likeRef.id,
                    post_id: postId,
                    user_id: userId,
                    type: 'like',
                };
                transaction.set(likeRef, {
                    ...likeData,
                    created_at: FieldValue.serverTimestamp()
                });
                transaction.update(postRef, { like_count: FieldValue.increment(1) });
                res.status(201).send({ data: { message: "Post liked successfully" } });
            }
        });

    } catch (error: any) {
        console.error("Error liking post:", error);
        if (error.message === "Post not found") {
            res.status(404).send({ message: "Post not found" });
        } else {
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
});

// GET /posts/:postId/comments - Get all comments for a post
router.get("/:postId/comments", async (req, res) => {
    try {
        const { postId } = req.params;

        const commentsSnapshot = await db.collection("posts").doc(postId).collection("interactions")
            .where('type', '==', 'comment')
            .orderBy('created_at', 'asc')
            .get();

        if (commentsSnapshot.empty) {
            res.status(200).send({ data: [] });
            return;
        }

        const comments = commentsSnapshot.docs.map(doc => doc.data());
        
        // Get user info for each comment author
        const userIds = [...new Set(comments.map(c => c.user_id))];
        const usersSnapshot = await db.collection("users").where(FieldPath.documentId(), 'in', userIds).get();
        
        const authors: { [key: string]: any } = {};
        usersSnapshot.forEach(userDoc => {
            const { email, ...publicProfile } = userDoc.data();
            authors[userDoc.id] = publicProfile;
        });

        const populatedComments = comments.map(comment => ({
            ...comment,
            author: authors[comment.user_id] || { display_name: "Anonymous" }
        }));
        
        res.status(200).send({ data: populatedComments });

    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


// POST /posts/:postId/comment - Comment on a post
router.post("/:postId/comment", authenticate, async (req: AuthenticatedRequest, res) => {
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

            const commentData: Omit<Interaction, "created_at"> = {
                id: commentRef.id,
                post_id: postId,
                user_id: userId,
                type: 'comment',
                content: content,
            };
            transaction.set(commentRef, {
                ...commentData,
                created_at: FieldValue.serverTimestamp()
            });
            transaction.update(postRef, { comment_count: FieldValue.increment(1) });
        });
        
        const newComment = (await commentRef.get()).data();
        res.status(201).send({ data: newComment });

    } catch (error: any) {
        console.error("Error commenting on post:", error);
        if (error.message === "Post not found") {
            res.status(404).send({ message: "Post not found" });
        } else {
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
});


export default router; 