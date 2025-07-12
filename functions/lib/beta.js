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
exports.betaSignup = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const nodemailer = __importStar(require("nodemailer"));
// Import FieldValue directly to avoid issues with the emulator stub
const firestore_1 = require("firebase-admin/firestore");
// Ensure Firebase is initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const db = admin.firestore();
exports.betaSignup = functions.https.onCall(async (request) => {
    const { email, choice } = request.data;
    // --- Input Validation ---
    if (!email || typeof email !== "string" || !email.includes("@")) {
        throw new functions.https.HttpsError("invalid-argument", "A valid email address is required.");
    }
    if (!choice || (choice !== "feedback" && choice !== "notify")) {
        throw new functions.https.HttpsError("invalid-argument", "A valid choice ('feedback' or 'notify') is required.");
    }
    try {
        // --- Storing in Firestore ---
        await db.collection("beta-access").add({
            email,
            choice,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
        });
        // --- Sending Confirmation Email ---
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: functions.config().gmail.email,
                pass: functions.config().gmail.password,
            },
        });
        const mailOptions = {
            from: `"ServerHeaven" <${functions.config().gmail.from_address || functions.config().gmail.email}>`,
            to: email,
            subject: "Welcome to the ServerHeaven Beta!",
            html: choice === "feedback"
                ? `<p>Thank you for your commitment! As a beta tester, you'll earn exclusive rewards upon the platform's official release. We'll be in touch soon.</p>`
                : `<p>Thanks for your interest! We'll notify you as soon as ServerHeaven is live.</p>`,
        };
        if (process.env.FUNCTIONS_EMULATOR === "true") {
            console.log("[EMULATOR] Mock email sent:", JSON.stringify(mailOptions, null, 2));
        }
        else {
            await transporter.sendMail(mailOptions);
        }
        return { success: true, message: "Signup successful and email sent." };
    }
    catch (error) {
        console.error("Error in betaSignup function:", error);
        // TODO: Add more robust error handling/logging
        throw new functions.https.HttpsError("internal", "An unexpected error occurred. Please try again later.");
    }
});
//# sourceMappingURL=beta.js.map