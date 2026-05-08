import { X } from "lucide-react";
import { useState, useEffect } from "react";

const SkillsSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [skills, setSkills] = useState(Array.isArray(userData?.skills) ? userData.skills : []);
	const [newSkill, setNewSkill] = useState("");

	useEffect(() => {
		if (Array.isArray(userData?.skills)) {
			setSkills(userData.skills);
		}
	}, [userData?.skills]);

	const handleAddSkill = () => {
		if (newSkill && !skills.includes(newSkill)) {
			setSkills([...skills, newSkill]);
			setNewSkill("");
		}
	};

	const handleDeleteSkill = (skill) => {
		setSkills(skills.filter((s) => s !== skill));
	};

	const handleSave = () => {
		onSave({ skills });
		setIsEditing(false);
	};

	return (
		<div className='glass-card rounded-3xl p-8 mb-8 hover-lift border-base-200/50'>
			<div className='flex items-center justify-between mb-8'>
				<h2 className='text-2xl font-bold text-neutral font-["Outfit"]'>Skills</h2>
				{isOwnProfile && !isEditing && (
					<button
						onClick={() => setIsEditing(true)}
						className='text-primary hover:bg-primary/5 px-4 py-1.5 rounded-xl font-bold text-sm premium-transition'
					>
						Edit Skills
					</button>
				)}
			</div>

			<div className='flex flex-wrap gap-3'>
				{skills.map((skill, index) => (
					<span
						key={index}
						className='bg-base-200/50 text-neutral/70 px-4 py-2 rounded-2xl text-[13px] font-bold border border-base-200 group flex items-center hover:bg-base-100 hover:border-primary/20 hover:shadow-soft-card premium-transition'
					>
						{skill}
						{isEditing && (
							<button 
								onClick={() => handleDeleteSkill(skill)} 
								className='ml-2 text-neutral/30 hover:text-error premium-transition'
							>
								<X size={16} strokeWidth={3} />
							</button>
						)}
					</span>
				))}
			</div>

			{isEditing && (
				<div className='mt-8 flex gap-2'>
					<input
						type='text'
						placeholder='Add a new expertise...'
						value={newSkill}
						onChange={(e) => setNewSkill(e.target.value)}
						className='input-premium flex-grow rounded-xl h-11 px-4 text-sm'
						onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
					/>
					<button
						onClick={handleAddSkill}
						className='btn btn-primary rounded-xl px-6 h-11 font-bold shadow-glow'
					>
						Add
					</button>
				</div>
			)}

			{isOwnProfile && isEditing && (
				<div className='mt-8 pt-6 border-t border-base-200/50 flex gap-3'>
					<button
						onClick={handleSave}
						className='btn btn-primary rounded-xl px-8 h-12 shadow-glow font-bold'
					>
						Save Skills
					</button>
					<button
						onClick={() => setIsEditing(false)}
						className='btn btn-ghost rounded-xl px-6 h-12 font-bold'
					>
						Cancel
					</button>
				</div>
			)}
		</div>
	);
};

export default SkillsSection;
