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
exports.completeBetaProfile = exports.unsubscribe = exports.verifyBetaToken = exports.betaSignup = void 0;
// Documentado em /purpleStone/Sistema de Acesso Beta.md
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const nodemailer = __importStar(require("nodemailer"));
const crypto = __importStar(require("crypto"));
const params_1 = require("firebase-functions/params");
const GMAIL_EMAIL = (0, params_1.defineString)("GMAIL_EMAIL");
const GMAIL_PASSWORD = (0, params_1.defineSecret)("GMAIL_PASSWORD");
const GMAIL_FROM_ADDRESS = (0, params_1.defineString)("GMAIL_FROM_ADDRESS");
// Import FieldValue directly to avoid issues with the emulator stub
const firestore_1 = require("firebase-admin/firestore");
const db = admin.firestore();
// --- Helper Functions ---
const getBaseUrls = () => {
    const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";
    const projectId = process.env.GCLOUD_PROJECT || "server-heaven-c6fb1";
    const frontendUrl = isEmulator
        ? "http://localhost:3000"
        : "https://server-heaven-c6fb1.web.app";
    const functionsUrl = isEmulator
        ? `http://127.0.0.1:5001/${projectId}/us-central1`
        : `https://us-central1-${projectId}.cloudfunctions.net`;
    return { frontendUrl, functionsUrl };
};
// --- Email Templates ---
const pioneerEmailTemplate = (confirmationLink, unsubscribeLink) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome, Pioneer!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin: 20px auto;">
                    <!-- Branded Header -->
                    <tr>
                        <td align="center" style="padding: 30px 0; border-bottom: 1px solid rgba(52, 211, 153, 0.2);">
                            <h1 style="color: #FAFAFA; font-family: monospace, sans-serif; font-size: 24px; margin: 0; letter-spacing: 4px; text-shadow: 0 0 5px rgba(52, 211, 153, 0.5);">
                                SERVERHEAVEN
                            </h1>
                        </td>
                    </tr>
                    <!-- Main Content Table -->
                    <tr>
                        <td>
                             <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border: 1px solid rgba(52, 211, 153, 0.3);">
                                <!-- Header -->
                                <tr>
                                    <td align="center" style="padding: 40px 0 30px 0; background-color: #111;">
                                        <h1 style="color: #FAFAFA; font-family: monospace, sans-serif; font-size: 32px; margin: 0; text-shadow: 0 0 10px rgba(52, 211, 153, 0.7);">
                                            You're a Pioneer!
                                        </h1>
                                    </td>
                                </tr>
                                <!-- Body -->
                                <tr>
                                    <td bgcolor="#0A0A0A" style="padding: 40px 30px 20px 30px; color: #A3A3A3; font-family: sans-serif; font-size: 16px; line-height: 1.5;">
                                        <p style="margin: 0 0 20px 0;">Thank you for your commitment to shaping the future of ServerHeaven. You're confirmed!</p>
                                        <p style="margin: 0 0 30px 0;">As a valued beta tester, you'll get early access to features and have a direct impact on our development.</p>
                                        
                                        <!-- Highlight Section for Reward -->
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; background-color: #022C22; border: 1px solid rgba(52, 211, 153, 0.4); border-radius: 8px;">
                                            <tr>
                                                <td style="padding: 20px; text-align: center;">
                                                    <p style="margin: 0 0 10px 0; font-family: monospace, sans-serif; font-size: 14px; color: #6EE7B7; text-transform: uppercase; letter-spacing: 1px;">Exclusive Reward</p>
                                                    <p style="margin: 0; font-family: sans-serif; font-size: 16px; color: #FAFAFA;">
                                                        For your contribution, you will receive the <strong style="color: #34D399; font-weight: bold;">Pioneer Badge</strong> on your profile upon the platform's official launch.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>

                                        <p style="margin: 30px 0 0 0;">Click the button below to complete your registration and secure your spot.</p>
                                    </td>
                                </tr>
                                <!-- CTA Button -->
                                 <tr>
                                    <td align="center" style="padding: 30px;">
                                        <a href="${confirmationLink}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: bold; font-family: monospace, sans-serif; color: #FFFFFF; text-decoration: none; border-radius: 8px; background: linear-gradient(to right, #10B981, #059669); box-shadow: 0 0 20px rgba(52, 211, 153, 0.4);">
                                            Create My Profile
                                        </a>
                                    </td>
                                </tr>
                                <!-- Footer -->
                                <tr>
                                    <td bgcolor="#111" style="padding: 30px; text-align: center; color: #A3A3A3; font-size: 12px;">
                                        <p style="margin: 0;">ServerHeaven &copy; 2025. All rights reserved.</p>
                                        <p style="margin: 10px 0 0 0;">You received this email because you signed up for the beta program. <a href="${unsubscribeLink}" style="color: #34D399;">Unsubscribe</a></p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
const notificationEmailTemplate = (unsubscribeLink) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thanks for your interest!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin: 20px auto;">
                     <!-- Branded Header -->
                    <tr>
                        <td align="center" style="padding: 30px 0; border-bottom: 1px solid rgba(52, 211, 153, 0.2);">
                            <h1 style="color: #FAFAFA; font-family: monospace, sans-serif; font-size: 24px; margin: 0; letter-spacing: 4px; text-shadow: 0 0 5px rgba(52, 211, 153, 0.5);">
                                SERVERHEAVEN
                            </h1>
                        </td>
                    </tr>
                     <!-- Main Content Table -->
                    <tr>
                        <td>
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border: 1px solid rgba(52, 211, 153, 0.3);">
                                <!-- Header -->
                                <tr>
                                    <td align="center" style="padding: 40px 0 30px 0; background-color: #111;">
                                        <h1 style="color: #FAFAFA; font-family: monospace, sans-serif; font-size: 32px; margin: 0; text-shadow: 0 0 8px rgba(52, 211, 153, 0.6);">
                                            See You At Launch!
                                        </h1>
                                    </td>
                                </tr>
                                <!-- Body -->
                                <tr>
                                    <td bgcolor="#0A0A0A" style="padding: 40px 30px; color: #A3A3A3; font-family: sans-serif; font-size: 16px; line-height: 1.5; text-align: center;">
                                        <p style="margin: 0 0 20px 0;">Thanks for your interest! We've received your email and will send you a one-time notification as soon as ServerHeaven is live.</p>
                                        <p style="margin: 0;">Get ready to find your next great gaming community.</p>
                                    </td>
                                </tr>
                                <!-- Footer -->
                                <tr>
                                    <td bgcolor="#111" style="padding: 30px; text-align: center; color: #A3A3A3; font-size: 12px;">
                                        <p style="margin: 0;">ServerHeaven &copy; 2025. All rights reserved.</p>
                                        <p style="margin: 10px 0 0 0;">You received this email because you asked to be notified of our launch. <a href="${unsubscribeLink}" style="color: #34D399;">Unsubscribe</a></p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
// Helper function to call the backup webhook
const callWebhookBackup = async (emailData) => {
    const webhookUrl = "https://hook.us1.make.com/vbpl6ya43jy6xzmq9y4c3bl25p2d28tg";
    try {
        functions.logger.info("Calling backup webhook.", { email: emailData.to });
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: emailData.to,
                subject: emailData.subject,
                html: emailData.html,
            }),
        });
        if (!response.ok) {
            const responseBody = await response.text();
            throw new Error(`Webhook call failed with status ${response.status}: ${responseBody}`);
        }
        functions.logger.info("Backup webhook called successfully.", { email: emailData.to });
    }
    catch (error) {
        functions.logger.error("Error calling backup webhook:", {
            errorMessage: error instanceof Error ? error.message : "Unknown error",
            errorStack: error instanceof Error ? error.stack : undefined,
            userEmail: emailData.to,
        });
        // We don't rethrow the error to avoid blocking the main flow
    }
};
// Deploys a new version every time to ensure secrets are updated.
exports.betaSignup = functions.https.onCall({ secrets: [GMAIL_PASSWORD] }, async (request) => {
    functions.logger.info("Starting betaSignup for a new user.");
    const { email, choice } = request.data;
    // --- Input Validation ---
    if (!email || typeof email !== "string" || !email.includes("@")) {
        throw new functions.https.HttpsError("invalid-argument", "A valid email address is required.");
    }
    if (!choice || (choice !== "feedback" && choice !== "notify")) {
        throw new functions.https.HttpsError("invalid-argument", "A valid choice ('feedback' or 'notify') is required.");
    }
    try {
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // Token valid for 48 hours
        // --- Storing in Firestore ---
        const betaRef = db.collection("beta-access").doc();
        await betaRef.set({
            email,
            choice,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
            confirmationToken: token,
            tokenExpiresAt: expiresAt,
            status: "pending", // "pending", "completed", "unsubscribed"
        });
        // --- Sending Confirmation Email ---
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: GMAIL_EMAIL.value(),
                pass: GMAIL_PASSWORD.value(),
            },
        });
        const { frontendUrl, functionsUrl } = getBaseUrls();
        const confirmationLink = `${frontendUrl}/beta/setup?token=${token}`;
        const unsubscribeLink = `${functionsUrl}/unsubscribe?token=${token}`;
        const isFeedback = choice === "feedback";
        const mailOptions = {
            from: `"ServerHeaven" <${GMAIL_FROM_ADDRESS.value() || GMAIL_EMAIL.value()}>`,
            to: email,
            subject: isFeedback ? "Welcome, Pioneer! Your ServerHeaven journey begins." : "You're on the list for ServerHeaven!",
            html: isFeedback ? pioneerEmailTemplate(confirmationLink, unsubscribeLink) : notificationEmailTemplate(unsubscribeLink),
        };
        // Call the backup webhook
        await callWebhookBackup({
            to: mailOptions.to,
            subject: mailOptions.subject,
            html: mailOptions.html,
        });
        if (process.env.FUNCTIONS_EMULATOR === "true") {
            console.log("[EMULATOR] Mock email sent:", JSON.stringify(mailOptions, null, 2));
        }
        else {
            await transporter.sendMail(mailOptions);
        }
        functions.logger.info(`Successfully processed beta signup for ${email}.`);
        return { success: true, message: "Signup successful and email sent." };
    }
    catch (error) {
        functions.logger.error("Error in betaSignup function:", {
            errorMessage: error instanceof Error ? error.message : "Unknown error",
            errorStack: error instanceof Error ? error.stack : undefined,
            userEmail: email, // Be mindful of logging PII
        });
        // TODO: Add more robust error handling/logging
        throw new functions.https.HttpsError("internal", "An unexpected error occurred. Please try again later.");
    }
});
/**
 * Verifies a beta access token to allow a user to proceed with profile creation.
 * To be called from the frontend before displaying the profile creation form.
 */
exports.verifyBetaToken = functions.https.onCall(async (request) => {
    const { token } = request.data;
    if (!token || typeof token !== "string") {
        throw new functions.https.HttpsError("invalid-argument", "A valid token is required.");
    }
    try {
        const accessQuery = await db.collection("beta-access").where("confirmationToken", "==", token).limit(1).get();
        if (accessQuery.empty) {
            throw new functions.https.HttpsError("not-found", "This invitation is invalid or has already been used.");
        }
        const doc = accessQuery.docs[0];
        const docData = doc.data();
        if (docData.status !== "pending") {
            throw new functions.https.HttpsError("failed-precondition", "This invitation has already been used or cancelled.");
        }
        if (docData.tokenExpiresAt.toDate() < new Date()) {
            // Optionally, update status to "expired"
            await doc.ref.update({ status: "expired" });
            throw new functions.https.HttpsError("deadline-exceeded", "This invitation has expired.");
        }
        // The token is valid, has not expired, and has not been used.
        return { success: true, email: docData.email };
    }
    catch (error) {
        console.error("Error in verifyBetaToken:", error);
        if (error instanceof functions.https.HttpsError) {
            throw error; // Re-throw HttpsError exceptions
        }
        throw new functions.https.HttpsError("internal", "An unexpected error occurred while verifying the invitation.");
    }
});
/**
 * Unsubscribes a user from beta communications using their unique token.
 * This is an HTTP-triggered function accessed via a link in an email.
 */
exports.unsubscribe = functions.https.onRequest(async (req, res) => {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
        res.status(400).send("A valid token is required.");
        return;
    }
    try {
        const accessQuery = await db.collection("beta-access").where("confirmationToken", "==", token).limit(1).get();
        if (!accessQuery.empty) {
            const docRef = accessQuery.docs[0].ref;
            await docRef.update({ status: "unsubscribed" });
        }
        // Always show a success message, even if the token wasn't found,
        // to avoid confirming whether an email/token is in the system.
        res.status(200).send(`
            <html lang="en">
            <body style="font-family: sans-serif; background-color: #0A0A0A; color: #FAFAFA; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
                <div style="text-align: center;">
                    <h1 style="color: #34D399;">Successfully Unsubscribed</h1>
                    <p>You will no longer receive beta program emails for this address.</p>
                </div>
            </body>
            </html>
        `);
    }
    catch (error) {
        console.error("Error in unsubscribe function:", error);
        res.status(500).send("An unexpected error occurred. Please try again later.");
    }
});
/**
 * # Implementa /purpleStone/Sistema de Autenticação e Perfis.md
 * Completes the beta profile setup by linking the beta access entry
 * to a newly created Firebase Auth user and saving their preferences.
 */
exports.completeBetaProfile = functions.https.onCall(async (request) => {
    const { token, uid, contribution, discordUsername } = request.data;
    // --- Input Validation ---
    if (!token || typeof token !== "string") {
        throw new functions.https.HttpsError("invalid-argument", "A valid token is required.");
    }
    if (!uid || typeof uid !== "string") {
        throw new functions.https.HttpsError("invalid-argument", "A valid user ID is required.");
    }
    if (!contribution || !Array.isArray(contribution) || contribution.length === 0) {
        throw new functions.https.HttpsError("invalid-argument", "Contribution preferences are required.");
    }
    try {
        // --- Verify Beta Token ---
        const accessQuery = await db.collection("beta-access").where("confirmationToken", "==", token).limit(1).get();
        if (accessQuery.empty) {
            throw new functions.https.HttpsError("not-found", "This invitation is invalid or has already been used.");
        }
        const docRef = accessQuery.docs[0].ref;
        const docData = accessQuery.docs[0].data();
        if (docData.status !== "pending") {
            throw new functions.https.HttpsError("failed-precondition", `This invitation has already been ${docData.status}.`);
        }
        if (docData.tokenExpiresAt.toDate() < new Date()) {
            await docRef.update({ status: "expired" });
            throw new functions.https.HttpsError("deadline-exceeded", "This invitation has expired.");
        }
        // --- Verify Auth User ---
        const authUser = await admin.auth().getUser(uid);
        if (authUser.email !== docData.email) {
            throw new functions.https.HttpsError("permission-denied", "The authenticated user email does not match the invitation email.");
        }
        // --- Update Firestore Document ---
        await docRef.update({
            status: "completed",
            completedAt: firestore_1.FieldValue.serverTimestamp(),
            uid: authUser.uid,
            contribution,
            discordUsername: discordUsername || null, // Store null if empty string
            // Clear token info for security
            confirmationToken: firestore_1.FieldValue.delete(),
            tokenExpiresAt: firestore_1.FieldValue.delete(),
        });
        // --- Set a custom claim for the user ---
        await admin.auth().setCustomUserClaims(authUser.uid, { betaPioneer: true });
        return { success: true, message: "Beta profile completed successfully." };
    }
    catch (error) {
        console.error("Error in completeBetaProfile:", error);
        if (error instanceof functions.https.HttpsError) {
            throw error; // Re-throw HttpsError exceptions
        }
        throw new functions.https.HttpsError("internal", "An unexpected error occurred while completing the profile.");
    }
});
//# sourceMappingURL=beta.js.map