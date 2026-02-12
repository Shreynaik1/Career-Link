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
		<div className='bg-secondary rounded-xl shadow-soft-card p-4 border border-base-200/60'>
			<div className='flex items-center gap-2 mb-3'>
				<Flame className='text-primary' size={18} />
				<h2 className='font-semibold text-sm'>Trending topics</h2>
			</div>
			<ul className='space-y-2 text-sm'>
				{topics.map((topic) => (
					<li key={topic.tag} className='flex items-center justify-between'>
						<span className='text-primary font-medium'>{topic.tag}</span>
						<span className='text-[11px] text-info'>{topic.count} posts</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default TrendingTopics;

