import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Check, Clock, UserCheck, UserPlus, X } from "lucide-react";

const RecommendedUser = ({ user }) => {
	const queryClient = useQueryClient();

	const { data: connectionStatus, isLoading } = useQuery({
		queryKey: ["connectionStatus", user._id],
		queryFn: () => axiosInstance.get(`/connections/status/${user._id}`),
	});

	const { mutate: sendConnectionRequest } = useMutation({
		mutationFn: (userId) => axiosInstance.post(`/connections/request/${userId}`),
		onSuccess: () => {
			toast.success("Connection request sent successfully");
			queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.error || "An error occurred");
		},
	});

	const { mutate: acceptRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request accepted");
			queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.error || "An error occurred");
		},
	});

	const { mutate: rejectRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request rejected");
			queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.error || "An error occurred");
		},
	});

	const renderButton = () => {
		if (isLoading) {
			return (
				<div className='size-8 rounded-xl bg-base-200 animate-pulse'></div>
			);
		}

		switch (connectionStatus?.data?.status)  {
			case "pending":
				return (
					<button
						className='size-9 rounded-xl bg-warning/10 text-warning flex items-center justify-center premium-transition'
						disabled
						title='Pending'
					>
						<Clock size={18} />
					</button>
				);
			case "received":
				return (
					<div className='flex gap-1.5'>
						<button
							onClick={() => acceptRequest(connectionStatus.data.requestId)}
							className='size-8 rounded-lg flex items-center justify-center bg-primary text-white shadow-glow hover:scale-105 premium-transition'
							title='Accept'
						>
							<Check size={16} strokeWidth={3} />
						</button>
						<button
							onClick={() => rejectRequest(connectionStatus.data.requestId)}
							className='size-8 rounded-lg flex items-center justify-center bg-error/10 text-error hover:bg-error/20 premium-transition'
							title='Decline'
						>
							<X size={16} strokeWidth={3} />
						</button>
					</div>
				);
			case "connected":
				return (
					<button
						className='size-9 rounded-xl bg-success/10 text-success flex items-center justify-center premium-transition'
						disabled
						title='Connected'
					>
						<UserCheck size={18} />
					</button>
				);
			default:
				return (
					<button
						className='size-9 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white flex items-center justify-center premium-transition shadow-sm hover:shadow-glow'
						onClick={handleConnect}
						title='Connect'
					>
						<UserPlus size={18} />
					</button>
				);
		}
	};

	const handleConnect = () => {
		if (connectionStatus?.data?.status === "not_connected") {
			sendConnectionRequest(user._id);
		}
	};

	return (
		<div className='flex items-center justify-between py-3 group hover:px-2 -mx-2 rounded-2xl hover:bg-primary/5 premium-transition'>
			<Link to={`/profile/${user.username}`} className='flex items-center gap-3 min-w-0'>
				<div className='relative'>
					<img
						src={user.profilePicture || "/avatar.png"}
						alt={user.name}
						className='size-10 rounded-xl object-cover shadow-soft-card group-hover:scale-105 premium-transition'
					/>
					<div className='absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 premium-transition'></div>
				</div>
				<div className='min-w-0'>
					<h3 className='font-bold text-[13px] text-neutral truncate group-hover:text-primary premium-transition leading-tight'>{user.name}</h3>
					<p className='text-[11px] text-neutral/50 font-medium line-clamp-1 mt-0.5'>{user.headline}</p>
				</div>
			</Link>
			<div className='ml-3 flex-shrink-0'>{renderButton()}</div>
		</div>
	);
};
export default RecommendedUser;
