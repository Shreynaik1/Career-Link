import { Link, useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";

function UserCard({ user, isConnection }) {
	const navigate = useNavigate();

	const handleMessage = () => {
		navigate(`/messages?userId=${user._id}`);
	};

	return (
		<div className='bg-white rounded-lg shadow p-4 flex flex-col items-center transition-all hover:shadow-md'>
			<Link to={`/profile/${user.username}`} className='flex flex-col items-center'>
				<img
					src={user.profilePicture || "/avatar.png"}
					alt={user.name}
					className='w-24 h-24 rounded-full object-cover mb-4'
				/>
				<h3 className='font-semibold text-lg text-center'>{user.name}</h3>
			</Link>
			<p className='text-gray-600 text-center'>{user.headline}</p>
			<p className='text-sm text-gray-500 mt-2'>{user.connections?.length} connections</p>
			{isConnection && (
				<button
					onClick={handleMessage}
					className='mt-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors w-full flex items-center justify-center gap-2'
				>
					<MessageSquare size={16} />
					Message
				</button>
			)}
		</div>
	);
}

export default UserCard;
