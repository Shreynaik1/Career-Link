import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Image, Loader } from "lucide-react";

const PostCreation = ({ user }) => {
	if (!user) return null;
	const [content, setContent] = useState("");
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);

	const queryClient = useQueryClient();

	const { mutate: createPostMutation, isPending } = useMutation({
		mutationFn: async (postData) => {
			const res = await axiosInstance.post("/posts/create", postData, {
				headers: { "Content-Type": "application/json" },
			});
			return res.data;
		},
		onSuccess: () => {
			resetForm();
			toast.success("Post created successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Failed to create post");
		},
	});

	const handlePostCreation = async () => {
		try {
			const postData = { content };
			if (image) postData.image = await readFileAsDataURL(image);

			createPostMutation(postData);
		} catch (error) {
			console.error("Error in handlePostCreation:", error);
		}
	};

	const resetForm = () => {
		setContent("");
		setImage(null);
		setImagePreview(null);
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImage(file);
		if (file) {
			readFileAsDataURL(file).then(setImagePreview);
		} else {
			setImagePreview(null);
		}
	};

	const readFileAsDataURL = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};

	return (
		<div className='glass-card rounded-2xl p-6 mb-6 hover-lift'>
			<div className='flex gap-4'>
				<img 
					src={user.profilePicture || "/avatar.png"} 
					alt={user.name} 
					className='size-12 rounded-xl object-cover shadow-soft-card' 
				/>
				<textarea
					placeholder="Share an insight, opportunity or milestone..."
					className='w-full p-4 rounded-xl bg-base-200/50 border-transparent focus:bg-base-100 focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none resize-none premium-transition min-h-[120px] text-sm font-medium'
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
			</div>

			{imagePreview && (
				<div className='mt-4 relative group'>
					<img src={imagePreview} alt='Selected' className='w-full h-auto rounded-2xl shadow-premium border border-base-200' />
					<button 
						onClick={() => { setImage(null); setImagePreview(null); }}
						className='absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 premium-transition'
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
					</button>
				</div>
			)}

			<div className='flex justify-between items-center mt-5 pt-4 border-t border-base-200/50'>
				<div className='flex gap-2'>
					<label className='flex items-center gap-2 px-4 py-2 rounded-xl text-neutral/60 hover:text-primary hover:bg-primary/5 cursor-pointer premium-transition font-semibold text-sm'>
						<Image size={18} className='text-primary' />
						<span>Media</span>
						<input type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
					</label>
					<button className='flex items-center gap-2 px-4 py-2 rounded-xl text-neutral/60 hover:text-accent hover:bg-accent/5 cursor-pointer premium-transition font-semibold text-sm'>
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='text-accent'><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
						<span>Event</span>
					</button>
				</div>

				<button
					className='btn btn-primary rounded-xl px-8 h-10 normal-case font-bold shadow-glow hover:shadow-primary/30 premium-transition'
					onClick={handlePostCreation}
					disabled={isPending || (!content.trim() && !image)}
				>
					{isPending ? <Loader className='size-5 animate-spin' /> : "Post"}
				</button>
			</div>
		</div>
	);
};
export default PostCreation;
