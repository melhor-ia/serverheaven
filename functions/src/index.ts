/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import cors from "cors";

const corsHandler = cors({origin: true});

admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const getGreeting = onRequest((request, response) => {
  corsHandler(request, response, () => {
    logger.info("getGreeting function called", {structuredData: true});
    response.status(200).send({
      message: "Hello from the backend!",
    });
  });
}); 