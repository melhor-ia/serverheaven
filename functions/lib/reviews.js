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
Object.defineProperty(exports, "__esModule", { value: true });
exports.onReviewCreate = void 0;
const functions = __importStar(require("firebase-functions"));
const express_1 = require("express");
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
const middleware_1 = require("./middleware");
const firestore_2 = require("firebase-functions/v2/firestore");
const router = (0, express_1.Router)();
const db = admin.firestore();
// POST /reviews - Create a new review
router.post("/", middleware_1.authenticate, async (req, res) => {
    try {
        const { rating, content, type, target_server_id, target_user_id, } = req.body;
        const author_id = req.user?.uid;
        if (!author_id) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        // Validate input
        if (!rating || rating < 1 || rating > 5) {
            res.status(400).send({
                message: "Invalid rating. Must be a number between 1 and 5.",
            });
            return;
        }
        if (!content) {
            res.status(400).send({ message: "Content cannot be empty." });
            return;
        }
        if (type !== "player_to_server" && type !== "server_to_player") {
            res.status(400).send({
                message: "Invalid review type. MVP only supports 'player_to_server' and 'server_to_player'.",
            });
            return;
        }
        if ((type === "player_to_server" && !target_server_id) || (type === "server_to_player" && !target_user_id)) {
            res.status(400).send({ message: "Missing target ID for the review type." });
            return;
        }
        const reviewRef = db.collection("reviews").doc();
        const newReviewData = {
            id: reviewRef.id,
            author_id,
            rating,
            content,
            type,
            status: "active",
        };
        if (type === "player_to_server") {
            newReviewData.target_server_id = target_server_id;
        }
        else if (type === "server_to_player") {
            newReviewData.target_user_id = target_user_id;
        }
        await reviewRef.set({
            ...newReviewData,
            created_at: firestore_1.FieldValue.serverTimestamp(),
            updated_at: firestore_1.FieldValue.serverTimestamp(),
        });
        functions.logger.info(`New review ${reviewRef.id} created by ${author_id}`);
        const reviewDoc = await reviewRef.get();
        const reviewData = reviewDoc.data();
        res.status(201).send(reviewData);
    }
    catch (error) {
        functions.logger.error("Error creating review:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
// GET /reviews/:targetId - Get all reviews for a specific target (user or server)
router.get("/:targetId", async (req, res) => {
    try {
        const { targetId } = req.params;
        if (!targetId) {
            res.status(400).send({ message: "Missing target ID." });
            return;
        }
        const reviewsRef = db.collection("reviews");
        const serverReviewsQuery = reviewsRef.where("target_server_id", "==", targetId);
        const userReviewsQuery = reviewsRef.where("target_user_id", "==", targetId);
        const [serverReviewsSnapshot, userReviewsSnapshot] = await Promise.all([
            serverReviewsQuery.get(),
            userReviewsQuery.get(),
        ]);
        const serverReviews = serverReviewsSnapshot.docs.map((doc) => doc.data());
        const userReviews = userReviewsSnapshot.docs.map((doc) => doc.data());
        const reviews = [...serverReviews, ...userReviews];
        reviews.sort((a, b) => {
            const timeA = a.created_at?.toMillis() || 0;
            const timeB = b.created_at?.toMillis() || 0;
            return timeB - timeA;
        });
        res.status(200).send(reviews);
    }
    catch (error) {
        functions.logger.error(`Error fetching reviews for target ${req.params.targetId}:`, error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
exports.onReviewCreate = (0, firestore_2.onDocumentCreated)("reviews/{reviewId}", (event) => {
    const snap = event.data;
    if (!snap) {
        functions.logger.error("No data associated with the event", { eventId: event.id });
        return;
    }
    const review = snap.data();
    const { target_server_id, target_user_id, rating } = review;
    let targetRef;
    if (target_server_id) {
        targetRef = db.collection("servers").doc(target_server_id);
    }
    else if (target_user_id) {
        targetRef = db.collection("users").doc(target_user_id);
    }
    else {
        functions.logger.error("Review is missing a target ID", { reviewId: snap.id });
        return;
    }
    try {
        return db.runTransaction(async (transaction) => {
            const targetDoc = await transaction.get(targetRef);
            if (!targetDoc.exists) {
                functions.logger.error("Target document not found for review", { reviewId: snap.id });
                return;
            }
            const targetData = targetDoc.data();
            if (!targetData) {
                functions.logger.error("Target data is empty for review", { reviewId: snap.id });
                return;
            }
            const currentRating = targetData.rating || { average: 0, count: 0 };
            const newCount = currentRating.count + 1;
            const newAverage = (currentRating.average * currentRating.count + rating) / newCount;
            transaction.update(targetRef, {
                rating: {
                    average: newAverage,
                    count: newCount,
                },
            });
        });
    }
    catch (error) {
        functions.logger.error("Failed to update rating on transaction.", {
            error,
            reviewId: snap.id,
        });
        return;
    }
});
exports.default = router;
//# sourceMappingURL=reviews.js.map