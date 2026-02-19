import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import ConversationList from "../components/messages/ConversationList";
import ChatWindow from "../components/messages/ChatWindow";
import { MessageSquare, Plus } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

const MessagesPage = () => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const initialUserId = searchParams.get("userId");
	const [selectedUserId, setSelectedUserId] = useState(initialUserId || null);

	const { data: conversations, isLoading } = useQuery({
		queryKey: ["conversations"],
		queryFn: async () => {
			try {
				const res = await axiosInstance.get("/messages/conversations");
				return res.data;
			} catch (error) {
				console.error("Error fetching conversations:", error);
				return [];
			}
		},
	});

	const { data: connections } = useQuery({
		queryKey: ["connections"],
		queryFn: async () => {
			try {
				const res = await axiosInstance.get("/connections");
				return res.data;
			} catch (error) {
				console.error("Error fetching connections:", error);
				return [];
			}
		},
	});

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-96'>
				<div className='loading loading-spinner loading-lg'></div>
			</div>
		);
	}

	return (
		<div className='max-w-6xl mx-auto'>
			<div className='bg-secondary rounded-xl shadow-soft-card border border-base-200/60 overflow-hidden'>
				<div className='grid grid-cols-1 lg:grid-cols-3 h-[calc(100vh-200px)]'>
					{/* Conversation List */}
					<div className='border-r border-base-200/60 overflow-y-auto flex flex-col'>
						<div className='p-4 border-b border-base-200/60 bg-base-100/50'>
							<div className='flex items-center justify-between mb-2'>
								<div className='flex items-center gap-2'>
									<MessageSquare className='text-primary' size={20} />
									<h1 className='text-xl font-semibold'>Messages</h1>
								</div>
							</div>
							{connections?.length > 0 && (
								<details className='dropdown dropdown-bottom w-full'>
									<summary className='btn btn-sm btn-primary btn-outline w-full'>
										<Plus size={16} />
										New Message
									</summary>
									<ul className='dropdown-content menu bg-secondary rounded-box z-[1] w-full p-2 shadow-lg border border-base-200 max-h-60 overflow-y-auto'>
										{connections
											.filter(
												(conn) =>
													!conversations?.some((conv) => conv.user._id === conn._id)
											)
											.map((connection) => (
												<li key={connection._id}>
													<button
														onClick={() => {
															setSelectedUserId(connection._id);
															setSearchParams({ userId: connection._id });
														}}
														className='flex items-center gap-2 p-2 hover:bg-base-100 rounded'
													>
														<img
															src={connection.profilePicture || "/avatar.png"}
															alt={connection.name}
															className='w-8 h-8 rounded-full'
														/>
														<span className='text-sm'>{connection.name}</span>
													</button>
												</li>
											))}
									</ul>
								</details>
							)}
						</div>
						<div className='flex-1 overflow-y-auto'>
							<ConversationList
								conversations={conversations || []}
								selectedUserId={selectedUserId}
								onSelectUser={(userId) => {
									setSelectedUserId(userId);
									setSearchParams({ userId });
								}}
							/>
						</div>
					</div>

					{/* Chat Window */}
					<div className='lg:col-span-2 flex flex-col'>
						{selectedUserId ? (
							<ChatWindow userId={selectedUserId} />
						) : (
							<div className='flex-1 flex items-center justify-center bg-base-100/30'>
								<div className='text-center'>
									<MessageSquare size={64} className='mx-auto text-info mb-4' />
									<p className='text-info text-lg'>Select a conversation to start messaging</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MessagesPage;
