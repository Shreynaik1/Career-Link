import { Link } from "react-router-dom";
import { Bell, Home, UserPlus } from "lucide-react";

function getProfileCompletion(user) {
	if (!user) return 0;

	const fields = [
		user.name,
		user.headline,
		user.location,
		user.about,
		user.experience?.length,
		user.education?.length,
		user.skills?.length,
		user.profilePicture,
		user.bannerImg,
	];

	const filled = fields.filter(Boolean).length;
	return Math.round((filled / fields.length) * 100);
}

export default function Sidebar({ user }) {
	const completion = getProfileCompletion(user);

	return (
		<div className='bg-secondary rounded-xl shadow-soft-card overflow-hidden border border-base-200/60'>
			<div className='p-4 text-center pb-5'>
				<div
					className='h-16 rounded-t-lg bg-cover bg-center'
					style={{
						backgroundImage: `linear-gradient(to right, rgba(10,102,194,0.82), rgba(56,189,248,0.75)), url("${
							user.bannerImg || "/banner.png"
						}")`,
					}}
				/>
				<Link to={`/profile/${user.username}`}>
					<img
						src={user.profilePicture || "/avatar.png"}
						alt={user.name}
						className='w-20 h-20 rounded-full mx-auto mt-[-40px] border-4 border-secondary shadow-soft-card object-cover'
					/>
					<h2 className='text-lg font-semibold mt-2'>{user.name}</h2>
				</Link>
				<p className='text-info text-sm line-clamp-2'>{user.headline}</p>
				<p className='text-info text-xs mt-1 font-medium'>{user.connections.length} connections</p>

				<div className='mt-4 text-left'>
					<div className='flex justify-between items-center text-xs font-medium mb-1'>
						<span className='text-info'>Profile strength</span>
						<span className='text-primary'>{completion}%</span>
					</div>
					<div className='w-full h-2 rounded-full bg-base-100 overflow-hidden'>
						<div
							className='h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-500'
							style={{ width: `${completion}%` }}
						/>
					</div>
				</div>
			</div>

			<div className='border-t border-base-100/80 p-4'>
				<nav>
					<ul className='space-y-1'>
						<li>
							<Link
								to='/'
								className='flex items-center py-2 px-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-sm'
							>
								<Home className='mr-2' size={18} /> Home
							</Link>
						</li>
						<li>
							<Link
								to='/network'
								className='flex items-center py-2 px-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-sm'
							>
								<UserPlus className='mr-2' size={18} /> My Network
							</Link>
						</li>
						<li>
							<Link
								to='/notifications'
								className='flex items-center py-2 px-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-sm'
							>
								<Bell className='mr-2' size={18} /> Notifications
							</Link>
						</li>
					</ul>
				</nav>
			</div>

			<div className='border-t border-base-100/80 p-4 bg-base-100/70'>
				<Link
					to={`/profile/${user.username}`}
					className='text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1'
				>
					<span>View full profile</span>
				</Link>
			</div>
		</div>
	);
}
