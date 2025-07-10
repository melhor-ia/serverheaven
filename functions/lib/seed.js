"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const firestore_1 = require("firebase-admin/firestore");
const db = (0, firestore_1.getFirestore)();
const seedDatabase = async () => {
    console.log("Seeding database with mock posts...");
    const postsCollection = db.collection("posts");
    const mockPosts = [
        {
            content: "Welcome to the first post on Server Heaven! We're excited to have you.",
            type: "update",
            author_user_id: "system",
        },
        {
            content: "Looking for skilled builders for our new medieval-themed server. DM for details!",
            type: "recruitment",
            author_user_id: "recruiter_jack",
        },
        {
            content: "Check out this awesome castle our players built over the weekend!",
            type: "media",
            author_user_id: "server_owner_jane",
            media_urls: ["https://i.imgur.com/caH4kQ2.jpeg"],
        },
        {
            content: "Don't miss our double XP event this Saturday at 8 PM EST!",
            type: "event",
            author_user_id: "event_master_mike",
        }
    ];
    const batch = db.batch();
    for (const post of mockPosts) {
        const newPostRef = postsCollection.doc();
        batch.set(newPostRef, {
            ...post,
            id: newPostRef.id,
            tags: ["mock", "seed"],
            status: 'active',
            like_count: 0,
            comment_count: 0,
            created_at: firestore_1.FieldValue.serverTimestamp(),
            updated_at: firestore_1.FieldValue.serverTimestamp(),
        });
    }
    await batch.commit();
    console.log("Database seeded successfully!");
    return { success: true, message: "Database seeded successfully!" };
};
exports.seedDatabase = seedDatabase;
//# sourceMappingURL=seed.js.map