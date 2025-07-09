// Implementa /purpleStone/_legacy/Modelagem de Dados.md (Server)
// Relacionado a /purpleStone/_legacy/Fluxos Principais de Usuário e API.md

import * as express from "express";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { authenticate, AuthenticatedRequest }from "./middleware";

// Based on /purpleStone/_legacy/Modelagem de Dados.md
interface Server {
    id: string;
    name: string;
    description: string;
    ip_address?: string;
    website_url?: string;
    discord_url?: string;
    tags: string[];
    rating: {
        average: number;
        count: number;
    };
    owner_id: string;
    game_id: string;
    created_at: FirebaseFirestore.Timestamp;
    updated_at: FirebaseFirestore.Timestamp;
    status: 'active' | 'suspended' | 'banned';
    admins: string[];
}

const router = express.Router();
const db = getFirestore();

// POST /servers - Create a new server
router.post("/", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.user?.uid;
        if (!userId) {
            res.status(401).send({message: "Unauthorized"});
            return;
        }

        const { name, description, ip_address, website_url, discord_url, tags, game_id } = req.body;

        if (!name || !description || !game_id) {
            res.status(400).send({ message: "Missing required fields: name, description, game_id" });
            return;
        }

        const newServerRef = db.collection("servers").doc();
        const serverData: Omit<Server, "created_at" | "updated_at"> = {
            id: newServerRef.id,
            name,
            description,
            ip_address: ip_address || "",
            website_url: website_url || "",
            discord_url: discord_url || "",
            tags: tags || [],
            rating: {
                average: 0,
                count: 0,
            },
            owner_id: userId,
            game_id,
            status: 'active',
            admins: [userId],
        };

        await newServerRef.set({
            ...serverData,
            created_at: FieldValue.serverTimestamp(),
            updated_at: FieldValue.serverTimestamp(),
        });

        const newServerDoc = await newServerRef.get();
        res.status(201).send(newServerDoc.data());
    } catch (error) {
        console.error("Error creating server:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// GET /servers/:serverId - Get server details
router.get("/:serverId", async (req, res) => {
    try {
        const { serverId } = req.params;
        const serverDoc = await db.collection("servers").doc(serverId).get();

        if (!serverDoc.exists) {
            res.status(404).send({ message: "Server not found" });
            return;
        }

        res.status(200).send(serverDoc.data());
    } catch (error) {
        console.error("Error fetching server:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// PATCH /servers/:serverId - Update a server
router.patch("/:serverId", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
        const { serverId } = req.params;
        const userId = req.user?.uid;

        if (!userId) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        const serverRef = db.collection("servers").doc(serverId);
        const serverDoc = await serverRef.get();

        if (!serverDoc.exists) {
            res.status(404).send({ message: "Server not found" });
            return;
        }

        const serverData = serverDoc.data() as Server;
        if (serverData.owner_id !== userId && !serverData.admins.includes(userId)) {
            res.status(403).send({ message: "Forbidden: You do not have permission to update this server." });
            return;
        }

        const { name, description, ip_address, website_url, discord_url, tags, game_id, status, admins } = req.body;
        const updateData: {[key: string]: any} = {};

        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (ip_address !== undefined) updateData.ip_address = ip_address;
        if (website_url !== undefined) updateData.website_url = website_url;
        if (discord_url !== undefined) updateData.discord_url = discord_url;
        if (tags !== undefined) updateData.tags = tags;
        if (game_id !== undefined) updateData.game_id = game_id;
        if (status !== undefined) updateData.status = status;
        if (admins !== undefined) updateData.admins = admins;


        if (Object.keys(updateData).length === 0) {
            res.status(400).send({ message: "No fields to update" });
            return;
        }

        updateData.updated_at = FieldValue.serverTimestamp();

        await serverRef.update(updateData);

        const updatedServerDoc = await serverRef.get();
        res.status(200).send(updatedServerDoc.data());

    } catch (error) {
        console.error("Error updating server:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// DELETE /servers/:serverId - Delete a server
router.delete("/:serverId", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
        const { serverId } = req.params;
        const userId = req.user?.uid;

        if (!userId) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        const serverRef = db.collection("servers").doc(serverId);
        const serverDoc = await serverRef.get();

        if (!serverDoc.exists) {
            res.status(404).send({ message: "Server not found" });
            return;
        }

        const serverData = serverDoc.data() as Server;
        if (serverData.owner_id !== userId) {
            res.status(403).send({ message: "Forbidden: You do not have permission to delete this server." });
            return;
        }

        await serverRef.delete();

        res.status(204).send();

    } catch (error) {
        console.error("Error deleting server:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

export default router; 