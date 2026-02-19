import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
	getConversations,
	getMessages,
	sendMessage,
	markAsRead,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/conversations", protectRoute, getConversations);
router.get("/:userId", protectRoute, getMessages);
router.post("/send", protectRoute, sendMessage);
router.put("/read/:userId", protectRoute, markAsRead);

export default router;
