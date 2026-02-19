import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";
import { Send, Loader } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

const ChatWindow = ({ userId }) => {
	const [message, setMessage] = useState("");
	const messagesEndRef = useRef(null);
	const queryClient = useQueryClient();

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const { data: chatData, isLoading, error: chatError } = useQuery({
		queryKey: ["messages", userId],
		queryFn: async () => {
			const res = await axiosInstance.get(`/messages/${userId}`);
			return res.data;
		},
		enabled: !!userId,
		retry: false,
	});

	const { mutate: sendMessage, isPending: isSending } = useMutation({
		mutationFn: async (content) => {
			const res = await axiosInstance.post("/messages/send", {
				receiverId: userId,
				content,
			});
			return res.data;
		},
		onSuccess: () => {
			setMessage("");
			queryClient.invalidateQueries({ queryKey: ["messages", userId] });
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		},
		onError: (error) => {
			const errorMessage = error.response?.data?.message || "Failed to send message";
			toast.error(errorMessage);
			console.error("Send message error:", error);
		},
	});

	// Mark messages as read when chat opens
	useEffect(() => {
		if (chatData && userId) {
			axiosInstance.put(`/messages/read/${userId}`).then(() => {
				queryClient.invalidateQueries({ queryKey: ["conversations"] });
			});
		}
	}, [userId, chatData, queryClient]);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [chatData?.messages]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (message.trim() && !isSending) {
			sendMessage(message.trim());
		}
	};

	if (isLoading) {
		return (
			<div className='flex-1 flex items-center justify-center'>
				<div className='loading loading-spinner loading-lg'></div>
			</div>
		);
	}

	if (chatError) {
		return (
			<div className='flex-1 flex items-center justify-center bg-base-100/30'>
				<div className='text-center p-4'>
					<p className='text-error font-semibold mb-2'>Error loading chat</p>
					<p className='text-info text-sm'>
						{chatError.response?.data?.message || "Unable to load messages. Please try again."}
					</p>
				</div>
			</div>
		);
	}

	if (!chatData || !chatData.otherUser) {
		return (
			<div className='flex-1 flex items-center justify-center bg-base-100/30'>
				<div className='text-center'>
					<div className='loading loading-spinner loading-lg'></div>
					<p className='text-info mt-4'>Loading user information...</p>
				</div>
			</div>
		);
	}

	const { messages, otherUser } = chatData;

	return (
		<div className='flex flex-col h-full'>
			{/* Header */}
			<div className='p-4 border-b border-base-200/60 bg-base-100/50'>
				<div className='flex items-center gap-3'>
					<Link to={`/profile/${otherUser?.username}`}>
						<img
							src={otherUser?.profilePicture || "/avatar.png"}
							alt={otherUser?.name}
							className='w-10 h-10 rounded-full object-cover'
						/>
					</Link>
					<div>
						<Link to={`/profile/${otherUser?.username}`}>
							<h3 className='font-semibold text-sm'>{otherUser?.name}</h3>
						</Link>
						<p className='text-xs text-info'>{otherUser?.headline}</p>
					</div>
				</div>
			</div>

			{/* Messages */}
			<div className='flex-1 overflow-y-auto p-4 space-y-4 bg-base-100/20'>
				{messages && messages.length > 0 ? (
					messages.map((msg) => {
						const isOwnMessage = msg.sender._id === authUser._id;
						return (
							<div
								key={msg._id}
								className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
							>
								<div
									className={`max-w-[70%] rounded-lg px-4 py-2 ${
										isOwnMessage
											? "bg-primary text-white rounded-br-none"
											: "bg-secondary text-neutral rounded-bl-none"
									}`}
								>
									{!isOwnMessage && (
										<p className='text-xs font-semibold mb-1 opacity-80'>{msg.sender.name}</p>
									)}
									<p className='text-sm'>{msg.content}</p>
									<p
										className={`text-[10px] mt-1 ${
											isOwnMessage ? "text-white/70" : "text-info"
										}`}
									>
										{formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
									</p>
								</div>
							</div>
						);
					})
				) : (
					<div className='text-center text-info py-8'>
						<p>No messages yet. Start the conversation!</p>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* Input */}
			<form onSubmit={handleSubmit} className='p-4 border-t border-base-200/60 bg-base-100/50'>
				<div className='flex gap-2'>
					<input
						type='text'
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder='Type a message...'
						className='flex-1 input input-sm rounded-full bg-secondary border-base-300 focus:outline-none focus:ring-2 focus:ring-primary/60'
						disabled={isSending}
					/>
					<button
						type='submit'
						disabled={!message.trim() || isSending}
						className='btn btn-sm btn-primary rounded-full px-4'
					>
						{isSending ? (
							<Loader size={18} className='animate-spin' />
						) : (
							<Send size={18} />
						)}
					</button>
				</div>
			</form>
		</div>
	);
};

export default ChatWindow;
