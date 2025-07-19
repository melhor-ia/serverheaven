
import * as express from "express";
import { getFirestore, FieldPath } from "firebase-admin/firestore";
import { authenticate, AuthenticatedRequest } from "./middleware";
import { UserDocument, preparePublicProfile } from "./users";

// Defines the structure for a notification document.
// Based on /purpleStone/Sistema de Notificações.md (to be created)
interface Notification {
    id: string;
    recipient_user_id: string;
    sender_user_id: string;
    type: 'like' | 'comment' | 'follow' | 'mention';
    resource_id: string; // e.g., post ID, comment ID
    resource_type: 'post' | 'comment';
    read: boolean;
    created_at: FirebaseFirestore.Timestamp;
}

const router = express.Router();
const db = getFirestore();

// GET /notifications - Fetches unread notifications for the authenticated user
router.get("/", authenticate, async (req: AuthenticatedRequest, res) => {
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

        const notificationsData = notificationsSnapshot.docs.map(doc => doc.data() as Notification);

        // Get sender info
        const senderIds = [...new Set(notificationsData.map(n => n.sender_user_id))];
        const sendersSnapshot = await db.collection("users").where(FieldPath.documentId(), 'in', senderIds).get();
        
        const senders: { [key: string]: any } = {};
        sendersSnapshot.forEach(userDoc => {
            const userData = userDoc.data() as UserDocument;
            senders[userDoc.id] = preparePublicProfile(userData);
        });

        const populatedNotifications = notificationsData.map(notification => ({
            ...notification,
            sender: senders[notification.sender_user_id] || null
        }));


        res.status(200).send({ data: populatedNotifications });

    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// POST /notifications/:notificationId/read - Marks a notification as read
router.post("/:notificationId/read", authenticate, async (req: AuthenticatedRequest, res) => {
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

        const notificationData = notificationDoc.data() as Notification;

        // Ensure the user is the recipient of the notification
        if (notificationData.recipient_user_id !== userId) {
            res.status(403).send({ message: "Forbidden: You cannot read this notification." });
            return;
        }

        await notificationRef.update({ read: true });

        res.status(200).send({ data: { message: "Notification marked as read" } });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

export default router; 