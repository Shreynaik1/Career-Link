import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";
import { Bell, Home, LogOut, MessageSquare, User, Users } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { useSearch } from "../../context/SearchContext.jsx";

const Navbar = () => {
	const { searchTerm, setSearchTerm } = useSearch();
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

	const { data: notifications } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => axiosInstance.get("/notifications"),
		enabled: !!authUser,
	});

	const { data: connectionRequests } = useQuery({
		queryKey: ["connectionRequests"],
		queryFn: async () => axiosInstance.get("/connections/requests"),
		enabled: !!authUser,
	});

	const { data: conversations } = useQuery({
		queryKey: ["conversations"],
		queryFn: async () => {
			try {
				const res = await axiosInstance.get("/messages/conversations");
				return res.data;
			} catch (error) {
				// Silently fail if messages endpoint doesn't exist or errors
				return [];
			}
		},
		enabled: !!authUser,
		retry: false,
	});

	const unreadMessagesCount = conversations?.reduce((count, conv) => count + (conv.unreadCount || 0), 0) || 0;

	const { mutate: logout } = useMutation({
		mutationFn: () => axiosInstance.post("/auth/logout"),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const unreadNotificationCount = notifications?.data.filter((notif) => !notif.read).length;
	const unreadConnectionRequestsCount = connectionRequests?.data?.length;

	return (
		<nav className='sticky top-0 z-20 bg-secondary/80 backdrop-blur-lg border-b border-base-200/70'>
			<div className='max-w-7xl mx-auto px-4'>
				<div className='flex justify-between items-center py-3 gap-4'>
					<div className='flex items-center space-x-3'>
						<Link to='/' className='flex items-center gap-2'>
							<img className='h-8 rounded shadow-soft-card' src='/small-logo.png' alt='Career Link' />
							<span className='hidden sm:inline font-semibold tracking-tight text-neutral'>
								CareerLink
							</span>
						</Link>
					</div>

					{authUser && (
						<div className='hidden md:flex flex-1 max-w-sm mx-4'>
							<input
								type='text'
								placeholder='Search people, posts, or opportunities'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className='input input-sm w-full rounded-full bg-base-100/80 border-base-300 focus:outline-none focus:ring-2 focus:ring-primary/60'
							/>
						</div>
					)}

					<div className='flex items-center gap-2 md:gap-4'>
						{authUser ? (
							<>
								<div className='flex items-center gap-3'>
									<Link to={"/"} className='text-neutral flex flex-col items-center text-xs gap-1'>
										<Home size={20} />
										<span className='hidden md:block'>Home</span>
									</Link>
									<Link
										to='/network'
										className='text-neutral flex flex-col items-center relative text-xs gap-1'
									>
										<Users size={20} />
										<span className='hidden md:block'>My Network</span>
										{unreadConnectionRequestsCount > 0 && (
											<span
												className='absolute -top-1 -right-1 md:right-3 bg-primary text-white text-[10px] 
										rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-[2px]'
											>
												{unreadConnectionRequestsCount}
											</span>
										)}
									</Link>
									<Link
										to='/notifications'
										className='text-neutral flex flex-col items-center relative text-xs gap-1'
									>
										<Bell size={20} />
										<span className='hidden md:block'>Notifications</span>
										{unreadNotificationCount > 0 && (
											<span
												className='absolute -top-1 -right-1 md:right-3 bg-primary text-white text-[10px] 
										rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-[2px]'
											>
												{unreadNotificationCount}
											</span>
										)}
									</Link>
									<Link
										to='/messages'
										className='text-neutral flex flex-col items-center relative text-xs gap-1'
									>
										<MessageSquare size={20} />
										<span className='hidden md:block'>Messages</span>
										{unreadMessagesCount > 0 && (
											<span
												className='absolute -top-1 -right-1 md:right-3 bg-primary text-white text-[10px] 
										rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-[2px]'
											>
												{unreadMessagesCount}
											</span>
										)}
									</Link>
									<Link
										to={`/profile/${authUser.username}`}
										className='text-neutral flex flex-col items-center text-xs gap-1'
									>
										<User size={20} />
										<span className='hidden md:block'>Me</span>
									</Link>
								</div>

								<div className='flex items-center gap-2'>
									<ThemeToggle />
									<button
										className='btn btn-sm btn-ghost gap-1 text-xs md:text-sm'
										onClick={() => logout()}
									>
										<LogOut size={18} />
										<span className='hidden md:inline'>Logout</span>
									</button>
								</div>
							</>
						) : (
							<>
								<ThemeToggle />
								<Link to='/login' className='btn btn-ghost btn-sm'>
									Sign In
								</Link>
								<Link to='/signup' className='btn btn-primary btn-sm rounded-full px-4'>
									Join now
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
