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
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const router = express_1.default.Router();
// GET /users/profile/:userId - Get user profile
router.get("/profile/:userId", async (req, res) => {
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
        logger.error("Error fetching user profile:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
// PATCH /users/profile - Update user profile
router.patch("/profile", middleware_1.authenticate, async (req, res) => {
    const userId = req.user?.uid;
    if (!userId) {
        res.status(401).send({ message: "Unauthorized" });
        return;
    }
    const { displayName, bio, avatarUrl } = req.body;
    const userProfile = {};
    if (displayName !== undefined)
        userProfile.display_name = displayName;
    if (bio !== undefined)
        userProfile.bio = bio;
    if (avatarUrl !== undefined)
        userProfile.avatar_url = avatarUrl;
    if (Object.keys(userProfile).length === 0) {
        res.status(400).send({ message: "No fields to update" });
        return;
    }
    userProfile.updated_at = firestore_1.FieldValue.serverTimestamp();
    try {
        const userRef = admin.firestore().collection("users").doc(userId);
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
        display_name: username,
        email: email || "",
        avatar_url: "",
        bio: "",
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