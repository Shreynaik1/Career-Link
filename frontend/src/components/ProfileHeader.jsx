import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

import { Camera, Clock, MapPin, UserCheck, UserPlus, X } from "lucide-react";

const ProfileHeader = ({ userData, onSave, isOwnProfile }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editedData, setEditedData] = useState({});
	const queryClient = useQueryClient();

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const { data: connectionStatus, refetch: refetchConnectionStatus } = useQuery({
		queryKey: ["connectionStatus", userData._id],
		queryFn: () => axiosInstance.get(`/connections/status/${userData._id}`),
		enabled: !isOwnProfile,
	});

	const isConnected = userData.connections?.some((connection) => 
		(typeof connection === 'string' ? connection : connection._id) === authUser?._id
	);

	const { mutate: sendConnectionRequest } = useMutation({
		mutationFn: (userId) => axiosInstance.post(`/connections/request/${userId}`),
		onSuccess: () => {
			toast.success("Connection request sent");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const { mutate: acceptRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request accepted");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const { mutate: rejectRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request rejected");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const { mutate: removeConnection } = useMutation({
		mutationFn: (userId) => axiosInstance.delete(`/connections/${userId}`),
		onSuccess: () => {
			toast.success("Connection removed");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const getConnectionStatus = useMemo(() => {
		if (isConnected) return "connected";
		return connectionStatus?.data?.status || "not_connected";
	}, [isConnected, connectionStatus]);

	const renderConnectionButton = () => {
		const baseClass = "text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center";
		switch (getConnectionStatus) {
			case "connected":
				return (
					<div className='flex gap-2 justify-center'>
						<div className={`${baseClass} bg-green-500 hover:bg-green-600`}>
							<UserCheck size={20} className='mr-2' />
							Connected
						</div>
						<button
							className={`${baseClass} bg-red-500 hover:bg-red-600 text-sm`}
							onClick={() => removeConnection(userData._id)}
						>
							<X size={20} className='mr-2' />
							Remove Connection
						</button>
					</div>
				);

			case "pending":
				return (
					<button className={`${baseClass} bg-yellow-500 hover:bg-yellow-600`}>
						<Clock size={20} className='mr-2' />
						Pending
					</button>
				);

			case "received":
				return (
					<div className='flex gap-2 justify-center'>
						<button
							onClick={() => acceptRequest(connectionStatus.data.requestId)}
							className={`${baseClass} bg-green-500 hover:bg-green-600`}
						>
							Accept
						</button>
						<button
							onClick={() => rejectRequest(connectionStatus.data.requestId)}
							className={`${baseClass} bg-red-500 hover:bg-red-600`}
						>
							Reject
						</button>
					</div>
				);
			default:
				return (
					<button
						onClick={() => sendConnectionRequest(userData._id)}
						className='bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center'
					>
						<UserPlus size={20} className='mr-2' />
						Connect
					</button>
				);
		}
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setEditedData((prev) => ({ ...prev, [event.target.name]: reader.result }));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSave = () => {
		onSave(editedData);
		setIsEditing(false);
	};

	return (
		<div className='glass-card rounded-3xl mb-8 overflow-hidden hover-lift'>
			<div
				className='relative h-64 bg-cover bg-center'
				style={{
					backgroundImage: `url('${editedData.bannerImg || userData.bannerImg || "/banner.png"}')`,
				}}
			>
				<div className='absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent'></div>
				{isEditing && (
					<label className='absolute top-4 right-4 bg-base-200/30 backdrop-blur-md p-3 rounded-2xl shadow-premium cursor-pointer hover:bg-base-200/50 premium-transition group'>
						<Camera size={22} className='text-white group-hover:scale-110 premium-transition' />
						<input
							type='file'
							className='hidden'
							name='bannerImg'
							onChange={handleImageChange}
							accept='image/*'
						/>
					</label>
				)}
			</div>

			<div className='px-8 pb-8'>
				<div className='relative -mt-24 mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6'>
					<div className='relative group inline-block mx-auto md:mx-0'>
						<img
							className='w-40 h-40 rounded-3xl object-cover border-8 border-base-100 shadow-premium'
							src={editedData.profilePicture || userData.profilePicture || "/avatar.png"}
							alt={userData.name}
						/>

						{isEditing && (
							<label className='absolute bottom-2 right-2 bg-primary p-3 rounded-2xl shadow-glow cursor-pointer hover:scale-110 premium-transition'>
								<Camera size={20} className='text-white' />
								<input
									type='file'
									className='hidden'
									name='profilePicture'
									onChange={handleImageChange}
									accept='image/*'
								/>
							</label>
						)}
					</div>

					<div className='flex-1 text-center md:text-left mb-2'>
						{isEditing ? (
							<input
								type='text'
								value={editedData.name ?? userData.name}
								onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
								className='text-3xl font-bold mb-2 bg-base-200/50 rounded-xl px-4 py-1 w-full max-w-md focus:ring-4 focus:ring-primary/10 border-transparent outline-none premium-transition'
							/>
						) : (
							<h1 className='text-3xl md:text-4xl font-bold mb-2 text-neutral font-["Outfit"]'>{userData.name}</h1>
						)}

						{isEditing ? (
							<input
								type='text'
								value={editedData.headline ?? userData.headline}
								onChange={(e) => setEditedData({ ...editedData, headline: e.target.value })}
								className='text-neutral/60 bg-base-200/50 rounded-xl px-4 py-1 w-full max-w-md focus:ring-4 focus:ring-primary/10 border-transparent outline-none premium-transition'
							/>
						) : (
							<p className='text-neutral/60 font-medium text-lg'>{userData.headline}</p>
						)}

						<div className='flex justify-center md:justify-start items-center mt-3 text-neutral/40 font-bold text-xs uppercase tracking-widest'>
							<MapPin size={14} className='mr-1.5' />
							{isEditing ? (
								<input
									type='text'
									value={editedData.location ?? userData.location}
									onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
									className='bg-base-200/50 rounded-lg px-2 py-0.5'
								/>
							) : (
								<span>{userData.location || "Global"}</span>
							)}
							<div className='mx-3 size-1 rounded-full bg-base-300'></div>
							<span className='text-primary'>{userData.connections?.length || 0} Connections</span>
						</div>
					</div>

					<div className='flex-shrink-0'>
						{isOwnProfile ? (
							isEditing ? (
								<div className='flex gap-3'>
									<button
										className='btn btn-primary rounded-2xl px-8 h-12 shadow-glow font-bold premium-transition'
										onClick={handleSave}
									>
										Save Changes
									</button>
									<button
										className='btn btn-ghost rounded-2xl px-6 h-12 font-bold hover:bg-error/10 hover:text-error premium-transition'
										onClick={() => setIsEditing(false)}
									>
										Cancel
									</button>
								</div>
							) : (
								<button
									onClick={() => setIsEditing(true)}
									className='btn btn-primary rounded-2xl px-8 h-12 shadow-glow font-bold premium-transition'
								>
									Edit Profile
								</button>
							)
						) : (
							<div className='flex justify-center'>{renderConnectionButton()}</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
export default ProfileHeader;
