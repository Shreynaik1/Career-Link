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
		<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
			<div className='hidden lg:block lg:col-span-1'>
				<Sidebar user={authUser} />
			</div>

			<div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
				<PostCreation user={authUser} />

				{searchTerm && (
					<p className='text-xs text-info mb-2'>
						Showing results for <span className='font-semibold text-neutral'>" {searchTerm} "</span>
					</p>
				)}

				{visiblePosts?.map((post) => (
					<Post key={post._id} post={post} />
				))}

				{visiblePosts && visiblePosts.length === 0 && (
					<div className='bg-secondary rounded-xl shadow-soft-card p-8 text-center border border-base-200/60'>
						<div className='mb-3'>
							<Users size={48} className='mx-auto text-primary' />
						</div>
						<h2 className='text-lg font-semibold mb-1 text-neutral'>No matching posts</h2>
						<p className='text-info text-sm'>
							Try searching for a different keyword or clear the search box to see all posts.
						</p>
					</div>
				)}

				{!searchTerm && posts?.length === 0 && (
					<div className='bg-secondary rounded-xl shadow-soft-card p-8 text-center border border-base-200/60'>
						<div className='mb-6'>
							<Users size={64} className='mx-auto text-primary' />
						</div>
						<h2 className='text-2xl font-bold mb-2 text-neutral'>No Posts Yet</h2>
						<p className='text-info mb-6'>
							Share your first update or connect with others to start seeing posts in your feed.
						</p>
					</div>
				)}
			</div>

			<div className='col-span-1 lg:col-span-1 hidden lg:flex flex-col gap-4'>
				{visibleRecommendedUsers?.length > 0 && (
					<div className='bg-secondary rounded-xl shadow-soft-card p-4 border border-base-200/60'>
						<h2 className='font-semibold mb-4 text-sm'>People you may know</h2>
						{visibleRecommendedUsers?.map((user) => (
							<RecommendedUser key={user._id} user={user} />
						))}
					</div>
				)}

				<TrendingTopics posts={posts} />
			</div>
		</div>
	);
};

export default HomePage;
