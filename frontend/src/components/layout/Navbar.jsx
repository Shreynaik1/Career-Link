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

	const unreadNotificationCount = notifications?.data?.filter((notif) => !notif.read).length || 0;
	const unreadConnectionRequestsCount = connectionRequests?.data?.length || 0;

	return (
		<nav className='sticky top-0 z-50 bg-base-100/80 backdrop-blur-xl border-b border-base-200/50'>
			<div className='max-w-7xl mx-auto px-6'>
				<div className='flex justify-between items-center h-16 gap-8'>
					<div className='flex items-center'>
						<Link to='/' className='flex items-center gap-2 group'>
							<div className='relative'>
								<img className='h-9 rounded-xl shadow-soft-card group-hover:scale-105 premium-transition' src='/small-logo.png' alt='Career Link' />
								<div className='absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 premium-transition'></div>
							</div>
							<span className='hidden sm:inline font-bold text-xl tracking-tight text-neutral font-["Outfit"]'>
								Career<span className='text-primary'>Link</span>
							</span>
						</Link>
					</div>

					{authUser && (
						<div className='hidden md:flex flex-1 max-w-md'>
							<div className='relative w-full group'>
								<input
									type='text'
									placeholder='Search people or posts...'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className='input input-premium w-full rounded-2xl pl-11 h-10 text-sm'
								/>
								<div className='absolute left-4 top-1/2 -translate-y-1/2 text-neutral/40 group-focus-within:text-primary premium-transition'>
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
								</div>
							</div>
						</div>
					)}

					<div className='flex items-center gap-1 md:gap-2'>
						{authUser ? (
							<>
								<div className='flex items-center'>
									<Link to={"/"} className='p-2 rounded-xl text-neutral/70 hover:text-primary hover:bg-primary/5 flex flex-col items-center gap-0.5 premium-transition group'>
										<Home size={22} className='group-hover:scale-110 premium-transition' />
										<span className='hidden lg:block text-[10px] font-medium'>Home</span>
									</Link>
									<Link
										to='/network'
										className='p-2 rounded-xl text-neutral/70 hover:text-primary hover:bg-primary/5 flex flex-col items-center relative gap-0.5 premium-transition group'
									>
										<Users size={22} className='group-hover:scale-110 premium-transition' />
										<span className='hidden lg:block text-[10px] font-medium'>Network</span>
										{unreadConnectionRequestsCount > 0 && (
											<span
												className='absolute top-1.5 right-1.5 bg-primary text-white text-[9px] font-bold
										rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-[2px] ring-2 ring-base-100'
											>
												{unreadConnectionRequestsCount}
											</span>
										)}
									</Link>
									<Link
										to='/notifications'
										className='p-2 rounded-xl text-neutral/70 hover:text-primary hover:bg-primary/5 flex flex-col items-center relative gap-0.5 premium-transition group'
									>
										<Bell size={22} className='group-hover:scale-110 premium-transition' />
										<span className='hidden lg:block text-[10px] font-medium'>Alerts</span>
										{unreadNotificationCount > 0 && (
											<span
												className='absolute top-1.5 right-1.5 bg-error text-white text-[9px] font-bold
										rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-[2px] ring-2 ring-base-100'
											>
												{unreadNotificationCount}
											</span>
										)}
									</Link>
									<Link
										to='/messages'
										className='p-2 rounded-xl text-neutral/70 hover:text-primary hover:bg-primary/5 flex flex-col items-center relative gap-0.5 premium-transition group'
									>
										<MessageSquare size={22} className='group-hover:scale-110 premium-transition' />
										<span className='hidden lg:block text-[10px] font-medium'>Messages</span>
										{unreadMessagesCount > 0 && (
											<span
												className='absolute top-1.5 right-1.5 bg-primary text-white text-[9px] font-bold
										rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-[2px] ring-2 ring-base-100'
											>
												{unreadMessagesCount}
											</span>
										)}
									</Link>
									<Link
										to={`/profile/${authUser.username}`}
										className='p-2 rounded-xl text-neutral/70 hover:text-primary hover:bg-primary/5 flex flex-col items-center gap-0.5 premium-transition group'
									>
										<User size={22} className='group-hover:scale-110 premium-transition' />
										<span className='hidden lg:block text-[10px] font-medium'>Profile</span>
									</Link>
								</div>

								<div className='h-8 w-[1px] bg-base-300 mx-2 hidden sm:block'></div>

								<div className='flex items-center gap-2'>
									<ThemeToggle />
									<button
										className='btn btn-sm btn-ghost hover:bg-error/5 hover:text-error rounded-xl gap-2 h-10 px-3'
										onClick={() => logout()}
									>
										<LogOut size={18} />
										<span className='hidden lg:inline font-medium'>Logout</span>
									</button>
								</div>
							</>
						) : (
							<>
								<div className='flex items-center gap-3'>
									<ThemeToggle />
									<Link to='/login' className='text-sm font-semibold text-neutral hover:text-primary premium-transition'>
										Sign In
									</Link>
									<Link to='/signup' className='btn btn-primary btn-sm rounded-2xl px-6 h-10 normal-case font-bold shadow-glow hover:shadow-primary/30'>
										Join Now
									</Link>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
