import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const ConversationList = ({ conversations, selectedUserId, onSelectUser }) => {
	if (!conversations || conversations.length === 0) {
		return (
			<div className='p-8 text-center'>
				<p className='text-info'>No conversations yet. Connect with someone to start messaging!</p>
			</div>
		);
	}

	return (
		<div className='divide-y divide-base-200/60'>
			{conversations.map((conversation) => {
				const user = conversation.user;
				const isSelected = selectedUserId === user._id;

				return (
					<button
						key={user._id}
						onClick={() => onSelectUser(user._id)}
						className={`w-full p-4 hover:bg-base-100/70 transition-colors text-left ${
							isSelected ? "bg-primary/10 border-l-4 border-l-primary" : ""
						}`}
					>
						<div className='flex items-start gap-3'>
							<Link
								to={`/profile/${user.username}`}
								onClick={(e) => e.stopPropagation()}
								className='flex-shrink-0'
							>
								<img
									src={user.profilePicture || "/avatar.png"}
									alt={user.name}
									className='w-12 h-12 rounded-full object-cover'
								/>
							</Link>
							<div className='flex-1 min-w-0'>
								<div className='flex items-center justify-between mb-1'>
									<h3 className='font-semibold text-sm truncate'>{user.name}</h3>
									{conversation.lastMessage && (
										<span className='text-[10px] text-info flex-shrink-0 ml-2'>
											{formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
												addSuffix: true,
											})}
										</span>
									)}
								</div>
								<p className='text-xs text-info line-clamp-1 mb-1'>{user.headline}</p>
								{conversation.lastMessage && (
									<p className='text-xs text-neutral line-clamp-1'>
										{conversation.lastMessage.content}
									</p>
								)}
								{conversation.unreadCount > 0 && (
									<div className='mt-2 flex justify-end'>
										<span className='bg-primary text-white text-[10px] rounded-full px-2 py-0.5'>
											{conversation.unreadCount}
										</span>
									</div>
								)}
							</div>
						</div>
					</button>
				);
			})}
		</div>
	);
};

export default ConversationList;
