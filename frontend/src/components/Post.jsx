import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { Loader, MessageCircle, Send, Share2, ThumbsUp, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import PostAction from "./PostAction";

const Post = ({ post }) => {
	const { postId } = useParams();

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const [showComments, setShowComments] = useState(false);
	const [newComment, setNewComment] = useState("");
	const [comments, setComments] = useState(post.comments || []);
	const isOwner = authUser?._id === post.author?._id;
	const isLiked = post.likes?.includes(authUser?._id);

	const queryClient = useQueryClient();

	const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
		mutationFn: async () => {
			await axiosInstance.delete(`/posts/delete/${post._id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			toast.success("Post deleted successfully");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const { mutate: createComment, isPending: isAddingComment } = useMutation({
		mutationFn: async (newComment) => {
			await axiosInstance.post(`/posts/${post._id}/comment`, { content: newComment });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			toast.success("Comment added successfully");
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Failed to add comment");
		},
	});

	const { mutate: likePost, isPending: isLikingPost } = useMutation({
		mutationFn: async () => {
			await axiosInstance.post(`/posts/${post._id}/like`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["post", postId] });
		},
	});

	const handleDeletePost = () => {
		if (!window.confirm("Are you sure you want to delete this post?")) return;
		deletePost();
	};

	const handleLikePost = async () => {
		if (isLikingPost) return;
		likePost();
	};

	const handleAddComment = async (e) => {
		e.preventDefault();
		if (newComment.trim()) {
			createComment(newComment);
			setNewComment("");
			setComments([
				...comments,
				{
					content: newComment,
					user: {
						_id: authUser._id,
						name: authUser.name,
						profilePicture: authUser.profilePicture,
					},
					createdAt: new Date(),
				},
			]);
		}
	};

	return (
		<div className='glass-card rounded-2xl mb-6 hover-lift border-base-200/50 overflow-hidden'>
			<div className='p-5'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center gap-3'>
						<Link to={`/profile/${post?.author?.username}`} className='relative group'>
							<img
								src={post.author.profilePicture || "/avatar.png"}
								alt={post.author.name}
								className='size-11 rounded-xl object-cover shadow-soft-card group-hover:scale-105 premium-transition'
							/>
							<div className='absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 premium-transition'></div>
						</Link>

						<div>
							<Link to={`/profile/${post?.author?.username}`}>
								<h3 className='font-bold text-[15px] text-neutral hover:text-primary premium-transition leading-tight'>
									{post.author.name}
								</h3>
							</Link>
							<p className='text-[12px] text-neutral/50 font-medium line-clamp-1'>{post.author.headline}</p>
							<p className='text-[10px] text-neutral/40 font-bold uppercase tracking-wider mt-0.5'>
								{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
							</p>
						</div>
					</div>
					{isOwner && (
						<button 
							onClick={handleDeletePost} 
							className='p-2 text-neutral/30 hover:text-error hover:bg-error/5 rounded-xl premium-transition'
						>
							{isDeletingPost ? <Loader size={18} className='animate-spin' /> : <Trash2 size={18} />}
						</button>
					)}
				</div>

				<p className='text-neutral/80 text-[15px] leading-relaxed mb-4 whitespace-pre-wrap'>{post.content}</p>
				
				{post.image && (
					<div className='relative rounded-2xl overflow-hidden mb-4 border border-base-200/50 shadow-soft-card'>
						<img src={post.image} alt='Post content' className='w-full h-auto object-cover' />
					</div>
				)}

				<div className='flex items-center gap-1 pt-2 border-t border-base-200/50'>
					<PostAction
						icon={<ThumbsUp size={18} className={isLiked ? "text-primary fill-primary/20" : ""} />}
						text={`Like`}
						badge={post.likes.length > 0 ? post.likes.length : null}
						onClick={handleLikePost}
						active={isLiked}
					/>

					<PostAction
						icon={<MessageCircle size={18} />}
						text={`Comment`}
						badge={comments.length > 0 ? comments.length : null}
						onClick={() => setShowComments(!showComments)}
					/>
					
					<PostAction icon={<Share2 size={18} />} text='Share' />
				</div>
			</div>

			{showComments && (
				<div className='bg-base-200/30 px-5 py-4 border-t border-base-200/50 space-y-4'>
					<div className='max-h-80 overflow-y-auto space-y-3 pr-2 scrollbar-hide'>
						{comments.length > 0 ? (
							comments.map((comment) => (
								<div key={comment._id} className='flex gap-3 group'>
									<img
										src={comment.user.profilePicture || "/avatar.png"}
										alt={comment.user.name}
										className='size-8 rounded-lg object-cover shadow-sm'
									/>
									<div className='flex-1 bg-base-100 p-3 rounded-2xl rounded-tl-none shadow-sm border border-base-200/50'>
										<div className='flex items-center justify-between mb-1'>
											<span className='font-bold text-xs text-neutral'>{comment.user.name}</span>
											<span className='text-[10px] text-neutral/40 font-medium'>
												{formatDistanceToNow(new Date(comment.createdAt))}
											</span>
										</div>
										<p className='text-sm text-neutral/70 leading-normal'>{comment.content}</p>
									</div>
								</div>
							))
						) : (
							<p className='text-center py-4 text-sm text-neutral/40 font-medium italic'>No comments yet. Be the first to share your thoughts!</p>
						)}
					</div>

					<form onSubmit={handleAddComment} className='flex items-center gap-2 relative'>
						<input
							type='text'
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder='Add a thoughtful comment...'
							className='input-premium w-full h-11 rounded-xl pl-4 pr-12 text-sm font-medium'
						/>
						<button
							type='submit'
							className='absolute right-1.5 top-1.5 size-8 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary-dark shadow-glow premium-transition'
							disabled={isAddingComment || !newComment.trim()}
						>
							{isAddingComment ? <Loader size={16} className='animate-spin' /> : <Send size={16} />}
						</button>
					</form>
				</div>
			)}
		</div>
	);
};
export default Post;
