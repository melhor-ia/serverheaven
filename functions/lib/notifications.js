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
const express = __importStar(require("express"));
const firestore_1 = require("firebase-admin/firestore");
const middleware_1 = require("./middleware");
const users_1 = require("./users");
const router = express.Router();
const db = (0, firestore_1.getFirestore)();
// GET /notifications - Fetches unread notifications for the authenticated user
router.get("/", middleware_1.authenticate, async (req, res) => {
    try {
        const userId = req.user?.uid;
        if (!userId) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        const notificationsSnapshot = await db.collection("notifications")
            .where("recipient_user_id", "==", userId)
            .where("read", "==", false)
            .orderBy("created_at", "desc")
            .limit(30)
            .get();
        if (notificationsSnapshot.empty) {
            res.status(200).send({ data: [] });
            return;
        }
        const notificationsData = notificationsSnapshot.docs.map(doc => doc.data());
        // Get sender info
        const senderIds = [...new Set(notificationsData.map(n => n.sender_user_id))];
        const sendersSnapshot = await db.collection("users").where(firestore_1.FieldPath.documentId(), 'in', senderIds).get();
        const senders = {};
        sendersSnapshot.forEach(userDoc => {
            const userData = userDoc.data();
            senders[userDoc.id] = (0, users_1.preparePublicProfile)(userData);
        });
        const populatedNotifications = notificationsData.map(notification => ({
            ...notification,
            sender: senders[notification.sender_user_id] || null
        }));
        res.status(200).send({ data: populatedNotifications });
    }
    catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
// POST /notifications/:notificationId/read - Marks a notification as read
router.post("/:notificationId/read", middleware_1.authenticate, async (req, res) => {
    try {
        const userId = req.user?.uid;
        const { notificationId } = req.params;
        if (!userId) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        const notificationRef = db.collection("notifications").doc(notificationId);
        const notificationDoc = await notificationRef.get();
        if (!notificationDoc.exists) {
            res.status(404).send({ message: "Notification not found" });
            return;
        }
        const notificationData = notificationDoc.data();
        // Ensure the user is the recipient of the notification
        if (notificationData.recipient_user_id !== userId) {
            res.status(403).send({ message: "Forbidden: You cannot read this notification." });
            return;
        }
        await notificationRef.update({ read: true });
        res.status(200).send({ data: { message: "Notification marked as read" } });
    }
    catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
exports.default = router;
//# sourceMappingURL=notifications.js.map