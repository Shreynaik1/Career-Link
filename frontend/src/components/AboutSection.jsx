import { useState, useEffect } from "react";

const AboutSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [about, setAbout] = useState(userData.about || "");

	useEffect(() => {
		setAbout(userData.about || "");
	}, [userData.about]);

	const handleSave = () => {
		setIsEditing(false);
		onSave({ about });
	};

	return (
		<div className='glass-card rounded-3xl p-8 mb-8 hover-lift border-base-200/50'>
			<div className='flex items-center justify-between mb-6'>
				<h2 className='text-2xl font-bold text-neutral font-["Outfit"]'>About</h2>
				{isOwnProfile && !isEditing && (
					<button
						onClick={() => setIsEditing(true)}
						className='text-primary hover:bg-primary/5 px-4 py-1.5 rounded-xl font-bold text-sm premium-transition'
					>
						Edit
					</button>
				)}
			</div>
			
			{isEditing ? (
				<div className='space-y-4'>
					<textarea
						value={about}
						onChange={(e) => setAbout(e.target.value)}
						className='w-full p-4 bg-base-200/50 rounded-2xl border-transparent focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/20 outline-none premium-transition min-h-[150px] text-neutral/80 font-medium leading-relaxed'
						placeholder='Share your professional story...'
					/>
					<div className='flex gap-3'>
						<button
							onClick={handleSave}
							className='btn btn-primary rounded-xl px-8 h-10 shadow-glow font-bold'
						>
							Save Insights
						</button>
						<button
							onClick={() => setIsEditing(false)}
							className='btn btn-ghost rounded-xl px-6 h-10 font-bold'
						>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<p className='text-neutral/70 font-medium leading-relaxed text-[15px] whitespace-pre-wrap'>
					{userData.about || "No professional summary provided yet. Share your journey to attract the right opportunities!"}
				</p>
			)}
		</div>
	);
};

export default AboutSection;
