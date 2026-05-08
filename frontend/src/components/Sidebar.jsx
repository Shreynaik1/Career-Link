import { Link } from "react-router-dom";
import { Bell, Home, Users } from "lucide-react";

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
	if (!user) return null;
	const completion = getProfileCompletion(user);

	return (
		<div className='glass-card rounded-2xl overflow-hidden hover-lift'>
			<div
				className='h-24 bg-cover bg-center relative'
				style={{
					backgroundImage: `url("${user.bannerImg || "/banner.png"}")`,
				}}
			>
				<div className='absolute inset-0 bg-gradient-to-b from-black/20 to-transparent'></div>
			</div>
			<div className='p-5 text-center -mt-12 relative'>
				<Link to={`/profile/${user.username}`} className='inline-block group'>
					<img
						src={user.profilePicture || "/avatar.png"}
						alt={user.name}
						className='w-24 h-24 rounded-2xl object-cover mx-auto border-4 border-base-100 shadow-premium group-hover:scale-105 premium-transition'
					/>
				</Link>
				<h2 className='text-xl font-bold mt-3 text-neutral font-["Outfit"] leading-tight'>{user.name}</h2>
				<p className='text-neutral/60 text-sm mt-1 font-medium'>{user.headline}</p>
				<div className='mt-4 flex flex-wrap justify-center gap-2'>
					<span className='px-3 py-1 bg-primary/10 text-primary text-[11px] font-bold rounded-full uppercase tracking-wider'>
						{user.connections?.length || 0} Connections
					</span>
				</div>
			</div>
			<div className='border-t border-base-200/50 p-4 bg-base-100/30'>
				<nav className='space-y-1'>
					<Link
						to='/'
						className='flex items-center gap-3 px-3 py-2 rounded-xl text-neutral/70 hover:text-primary hover:bg-primary/5 premium-transition group'
					>
						<Home size={18} className='group-hover:scale-110 premium-transition' />
						<span className='text-sm font-semibold'>Feed</span>
					</Link>
					<Link
						to='/network'
						className='flex items-center gap-3 px-3 py-2 rounded-xl text-neutral/70 hover:text-primary hover:bg-primary/5 premium-transition group'
					>
						<Users size={18} className='group-hover:scale-110 premium-transition' />
						<span className='text-sm font-semibold'>My Network</span>
					</Link>
					<Link
						to='/notifications'
						className='flex items-center gap-3 px-3 py-2 rounded-xl text-neutral/70 hover:text-primary hover:bg-primary/5 premium-transition group'
					>
						<Bell size={18} className='group-hover:scale-110 premium-transition' />
						<span className='text-sm font-semibold'>Notifications</span>
					</Link>
				</nav>
			</div>
			<div className='p-4 border-t border-base-200/50'>
				<Link
					to={`/profile/${user.username}`}
					className='btn btn-primary btn-sm w-full rounded-xl normal-case font-bold h-10 shadow-glow'
				>
					View Profile
				</Link>
			</div>
		</div>
	);
}
