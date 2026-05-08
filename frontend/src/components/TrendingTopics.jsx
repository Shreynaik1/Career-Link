import { useMemo } from "react";
import { Flame } from "lucide-react";

const extractHashtags = (posts) => {
	if (!posts) return [];
	const tagCount = {};

	posts.forEach((post) => {
		if (!post.content) return;
		const matches = post.content.match(/#\w+/g) || [];
		matches.forEach((tag) => {
			const normalized = tag.toLowerCase();
			tagCount[normalized] = (tagCount[normalized] || 0) + 1;
		});
	});

	return Object.entries(tagCount)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([tag, count]) => ({ tag, count }));
};

const TrendingTopics = ({ posts }) => {
	const topics = useMemo(() => extractHashtags(posts), [posts]);

	if (!topics.length) return null;

	return (
		<div className='glass-card rounded-2xl p-5 border-base-200/50'>
			<div className='flex items-center gap-2 mb-5'>
				<Flame className='text-primary' size={20} />
				<h2 className='font-bold text-sm text-neutral/40 uppercase tracking-widest'>Trending topics</h2>
			</div>
			<ul className='space-y-3'>
				{topics.map((topic) => (
					<li key={topic.tag} className='group cursor-pointer'>
						<div className='flex items-center justify-between'>
							<span className='text-sm font-bold text-neutral group-hover:text-primary premium-transition'>{topic.tag}</span>
							<span className='text-[10px] bg-base-200 text-neutral/50 px-2 py-0.5 rounded-md font-bold'>{topic.count}</span>
						</div>
						<p className='text-[10px] text-neutral/40 font-medium mt-0.5 group-hover:text-neutral/60 premium-transition'>Trending in your network</p>
					</li>
				))}
			</ul>
			<button className='w-full mt-6 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest text-primary/60 hover:text-primary hover:bg-primary/5 premium-transition'>
				Show More
			</button>
		</div>
	);
};

export default TrendingTopics;

