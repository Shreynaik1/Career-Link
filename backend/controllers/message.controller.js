import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// Get all conversations for the current user
export const getConversations = async (req, res) => {
	try {
		const userId = req.user._id;

		// Get all unique users the current user has messaged with or received messages from
		const sentMessages = await Message.find({ sender: userId }).distinct("receiver");
		const receivedMessages = await Message.find({ receiver: userId }).distinct("sender");

		const allUserIds = [...new Set([...sentMessages.map(String), ...receivedMessages.map(String)])];

		// Get the last message and unread count for each conversation
		const conversations = await Promise.all(
			allUserIds.map(async (otherUserId) => {
				const lastMessage = await Message.findOne({
					$or: [
						{ sender: userId, receiver: otherUserId },
						{ sender: otherUserId, receiver: userId },
					],
				})
					.sort({ createdAt: -1 })
					.populate("sender", "name profilePicture username")
					.populate("receiver", "name profilePicture username");

				const unreadCount = await Message.countDocuments({
					sender: otherUserId,
					receiver: userId,
					read: false,
				});

				const otherUser = await User.findById(otherUserId).select("name profilePicture username headline");

				return {
					user: otherUser,
					lastMessage: lastMessage
						? {
								content: lastMessage.content,
								createdAt: lastMessage.createdAt,
								senderId: lastMessage.sender._id.toString(),
						  }
						: null,
					unreadCount,
				};
			})
		);

		// Sort by last message time
		conversations.sort((a, b) => {
			if (!a.lastMessage) return 1;
			if (!b.lastMessage) return -1;
			return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
		});

		res.json(conversations);
	} catch (error) {
		console.error("Error in getConversations:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Get messages between current user and another user
export const getMessages = async (req, res) => {
	try {
		const userId = req.user._id;
		const otherUserId = req.params.userId;

		// Verify the other user exists
		const otherUser = await User.findById(otherUserId);
		if (!otherUser) {
			return res.status(404).json({ message: "User not found" });
		}

		// Get all messages between the two users
		const messages = await Message.find({
			$or: [
				{ sender: userId, receiver: otherUserId },
				{ sender: otherUserId, receiver: userId },
			],
		})
			.sort({ createdAt: 1 })
			.populate("sender", "name profilePicture username")
			.populate("receiver", "name profilePicture username");

		// Mark messages as read
		await Message.updateMany(
			{
				sender: otherUserId,
				receiver: userId,
				read: false,
			},
			{ $set: { read: true } }
		);

		res.json({ messages, otherUser });
	} catch (error) {
		console.error("Error in getMessages:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Send a message
export const sendMessage = async (req, res) => {
	try {
		const userId = req.user._id;
		const { receiverId, content } = req.body;

		if (!receiverId || !content || !content.trim()) {
			return res.status(400).json({ message: "Receiver ID and message content are required" });
		}

		// Verify receiver exists
		const receiver = await User.findById(receiverId);
		if (!receiver) {
			return res.status(404).json({ message: "Receiver not found" });
		}

		// Check if users are connected (optional - you can remove this if you want to allow messaging anyone)
		const sender = await User.findById(userId);
		const isConnected = sender.connections.some(
			(connId) => connId.toString() === receiverId.toString()
		);
		if (!isConnected) {
			return res.status(403).json({ message: "You can only message your connections" });
		}

		const message = new Message({
			sender: userId,
			receiver: receiverId,
			content: content.trim(),
		});

		await message.save();

		const populatedMessage = await Message.findById(message._id)
			.populate("sender", "name profilePicture username")
			.populate("receiver", "name profilePicture username");

		res.status(201).json(populatedMessage);
	} catch (error) {
		console.error("Error in sendMessage:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Mark messages as read
export const markAsRead = async (req, res) => {
	try {
		const userId = req.user._id;
		const senderId = req.params.userId;

		await Message.updateMany(
			{
				sender: senderId,
				receiver: userId,
				read: false,
			},
			{ $set: { read: true } }
		);

		res.json({ message: "Messages marked as read" });
	} catch (error) {
		console.error("Error in markAsRead:", error);
		res.status(500).json({ message: "Server error" });
	}
};
