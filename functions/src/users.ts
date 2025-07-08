import * as functions from "firebase-functions/v1";
import {auth} from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

if (admin.apps.length === 0) {
    admin.initializeApp();
}

export const onUserCreate = functions.auth.user().onCreate(async (user: auth.UserRecord) => {
    const { uid, email } = user;
    const username = email?.split("@")[0] || uid;

    const newUser = {
        id: uid,
        username: username,
        display_name: username,
        email: email || "",
        avatar_url: "",
        bio: "",
        reputation_score: 0,
        is_supporter: false,
        supporter_since: null,
        created_at: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp(),
        status: "active",
    };

    await admin.firestore().collection("users").doc(uid).set(newUser);
}); 