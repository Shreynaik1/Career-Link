import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import { Users } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";
import TrendingTopics from "../components/TrendingTopics";
import { useSearch } from "../context/SearchContext.jsx";

const HomePage = () => {
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const { searchTerm } = useSearch();

	const { data: recommendedUsers } = useQuery({
		queryKey: ["recommendedUsers"],
		queryFn: async () => {
			const res = await axiosInstance.get("/users/suggestions");
			return res.data;
		},
	});

	const { data: posts } = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			const res = await axiosInstance.get("/posts");
			return res.data;
		},
	});

	const normalizedSearch = searchTerm.trim().toLowerCase();

	const visiblePosts = useMemo(() => {
		if (!posts || !normalizedSearch) return posts;
		return posts.filter((post) => {
			const content = (post.content || "").toLowerCase();
			const authorName = (post.author?.name || "").toLowerCase();
			const headline = (post.author?.headline || "").toLowerCase();
			return (
				content.includes(normalizedSearch) ||
				authorName.includes(normalizedSearch) ||
				headline.includes(normalizedSearch)
			);
		});
	}, [posts, normalizedSearch]);

	const visibleRecommendedUsers = useMemo(() => {
		if (!recommendedUsers || !normalizedSearch) return recommendedUsers;
		return recommendedUsers.filter((user) => {
			const name = (user.name || "").toLowerCase();
			const headline = (user.headline || "").toLowerCase();
			return name.includes(normalizedSearch) || headline.includes(normalizedSearch);
		});
	}, [recommendedUsers, normalizedSearch]);

	return (
		<div className='grid grid-cols-1 lg:grid-cols-4 gap-8 py-6'>
			<div className='hidden lg:block lg:col-span-1'>
				<Sidebar user={authUser} />
			</div>

			<div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
				<PostCreation user={authUser} />

				{searchTerm && (
					<div className='mb-4 flex items-center gap-2'>
						<span className='px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider'>
							Search Results
						</span>
						<p className='text-sm text-neutral/50'>
							for <span className='font-bold text-neutral'>"{searchTerm}"</span>
						</p>
					</div>
				)}

				<div className='space-y-2'>
					{visiblePosts?.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>

				{visiblePosts && visiblePosts.length === 0 && (
					<div className='glass-card rounded-2xl p-12 text-center animate-fade-in'>
						<div className='size-20 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6'>
							<Users size={40} className='text-primary/40' />
						</div>
						<h2 className='text-xl font-bold text-neutral mb-2 font-["Outfit"]'>No matching posts found</h2>
						<p className='text-neutral/50 text-sm max-w-xs mx-auto leading-relaxed'>
							Try adjusting your search terms or explore new topics to find what you're looking for.
						</p>
					</div>
				)}

				{!searchTerm && posts?.length === 0 && (
					<div className='glass-card rounded-2xl p-12 text-center animate-fade-in'>
						<div className='size-20 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6'>
							<Users size={40} className='text-primary/40' />
						</div>
						<h2 className='text-xl font-bold text-neutral mb-2 font-["Outfit"]'>Your feed is waiting</h2>
						<p className='text-neutral/50 text-sm max-w-xs mx-auto leading-relaxed mb-6'>
							Share your first insight or follow professional peers to start building your network.
						</p>
						<button className='btn btn-primary rounded-xl px-8 shadow-glow normal-case font-bold'>
							Find Connections
						</button>
					</div>
				)}
			</div>

			<div className='col-span-1 lg:col-span-1 hidden lg:flex flex-col gap-6'>
				{visibleRecommendedUsers?.length > 0 && (
					<div className='glass-card rounded-2xl p-5 border-base-200/50'>
						<h2 className='font-bold text-sm text-neutral/40 uppercase tracking-widest mb-5 flex items-center gap-2'>
							<div className='w-1.5 h-1.5 rounded-full bg-primary animate-pulse'></div>
							People you may know
						</h2>
						<div className='space-y-1'>
							{visibleRecommendedUsers?.map((user) => (
								<RecommendedUser key={user._id} user={user} />
							))}
						</div>
					</div>
				)}

				<TrendingTopics posts={posts} />
			</div>
		</div>
	);
};

export default HomePage;
