import { Briefcase, X } from "lucide-react";
import { useState, useEffect } from "react";
import { format, parseISO, isValid } from "date-fns";

// Inlined helper to avoid import issues while debugging
const safeFormatDate = (dateString) => {
	if (!dateString) return "Present";
	try {
		const date = parseISO(dateString);
		return isValid(date) ? format(date, "MMM yyyy") : "Present";
	} catch (e) {
		return "Present";
	}
};

const ExperienceSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [experiences, setExperiences] = useState([]);
	const [newExperience, setNewExperience] = useState({
		title: "",
		company: "",
		startDate: "",
		endDate: "",
		description: "",
		currentlyWorking: false,
	});

	useEffect(() => {
		if (userData?.experience && Array.isArray(userData.experience)) {
			setExperiences(userData.experience);
		} else {
			setExperiences([]);
		}
	}, [userData?.experience]);

	const handleAddExperience = () => {
		if (newExperience.title && newExperience.company && newExperience.startDate) {
			setExperiences([...experiences, { ...newExperience, _id: Date.now().toString() }]);

			setNewExperience({
				title: "",
				company: "",
				startDate: "",
				endDate: "",
				description: "",
				currentlyWorking: false,
			});
		}
	};

	const handleDeleteExperience = (id) => {
		setExperiences(experiences.filter((exp) => exp._id !== id));
	};

	const handleSave = () => {
		onSave({ experience: experiences });
		setIsEditing(false);
	};

	const handleCurrentlyWorkingChange = (e) => {
		setNewExperience({
			...newExperience,
			currentlyWorking: e.target.checked,
			endDate: e.target.checked ? "" : newExperience.endDate,
		});
	};

	if (!userData) return null;

	return (
		<div className='glass-card rounded-3xl p-8 mb-8 hover-lift border-base-200/50'>
			<div className='flex items-center justify-between mb-8'>
				<h2 className='text-2xl font-bold text-neutral font-["Outfit"]'>Experience</h2>
				{isOwnProfile && !isEditing && (
					<button
						onClick={() => setIsEditing(true)}
						className='text-primary hover:bg-primary/5 px-4 py-1.5 rounded-xl font-bold text-sm premium-transition'
					>
						Edit Experiences
					</button>
				)}
			</div>

			<div className='space-y-8 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-base-200'>
				{experiences.length > 0 ? (
					experiences.map((exp, index) => (
						<div key={exp._id || index} className='relative pl-14 group'>
							<div className='absolute left-0 top-1 size-12 bg-base-100 rounded-2xl shadow-soft-card border border-base-200 flex items-center justify-center group-hover:border-primary/30 group-hover:shadow-glow premium-transition z-10'>
								<Briefcase size={20} className='text-primary/60 group-hover:text-primary premium-transition' />
							</div>
							
							<div className='flex justify-between items-start'>
								<div className='flex-1'>
									<h3 className='font-bold text-lg text-neutral leading-tight'>{exp.title}</h3>
									<p className='text-primary font-bold text-sm mt-0.5'>{exp.company}</p>
									<p className='text-neutral/40 font-bold text-[11px] uppercase tracking-wider mt-1.5 flex items-center gap-2'>
										{safeFormatDate(exp.startDate)} — {exp.currentlyWorking ? "Present" : safeFormatDate(exp.endDate)}
									</p>
									<p className='text-neutral/60 text-[14px] mt-3 leading-relaxed font-medium'>{exp.description}</p>
								</div>
								
								{isEditing && (
									<button 
										onClick={() => handleDeleteExperience(exp._id)} 
										className='p-2 text-neutral/20 hover:text-error hover:bg-error/5 rounded-xl premium-transition'
									>
										<X size={20} />
									</button>
								)}
							</div>
						</div>
					))
				) : (
					<p className='pl-14 text-neutral/40 italic text-sm'>No experience listed yet.</p>
				)}
			</div>

			{isEditing && (
				<div className='mt-12 p-6 bg-base-100/50 rounded-2xl border border-base-200/50 space-y-4'>
					<h3 className='font-bold text-sm text-neutral/40 uppercase tracking-widest mb-2'>Add New Role</h3>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<input
							type='text'
							placeholder='Job Title'
							value={newExperience.title}
							onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
							className='input-premium w-full rounded-xl h-11 px-4 text-sm'
						/>
						<input
							type='text'
							placeholder='Company Name'
							value={newExperience.company}
							onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
							className='input-premium w-full rounded-xl h-11 px-4 text-sm'
						/>
					</div>
					
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-1.5'>
							<label className='text-[10px] font-bold text-neutral/40 uppercase ml-2'>Start Date</label>
							<input
								type='date'
								value={newExperience.startDate}
								onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
								className='input-premium w-full rounded-xl h-11 px-4 text-sm'
							/>
						</div>
						<div className='space-y-1.5'>
							<label className='text-[10px] font-bold text-neutral/40 uppercase ml-2'>End Date</label>
							<input
								type='date'
								value={newExperience.endDate}
								onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
								className='input-premium w-full rounded-xl h-11 px-4 text-sm disabled:opacity-50'
								disabled={newExperience.currentlyWorking}
							/>
						</div>
					</div>

					<div className='flex items-center gap-3 px-2'>
						<input
							type='checkbox'
							id='currentlyWorking'
							checked={newExperience.currentlyWorking}
							onChange={handleCurrentlyWorkingChange}
							className='checkbox checkbox-primary checkbox-sm rounded-md'
						/>
						<label htmlFor='currentlyWorking' className='text-sm font-semibold text-neutral/60 cursor-pointer'>
							I currently work here
						</label>
					</div>

					<textarea
						placeholder='What did you achieve in this role?'
						value={newExperience.description}
						onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
						className='input-premium w-full rounded-2xl p-4 text-sm min-h-[100px]'
					/>
					
					<button
						onClick={handleAddExperience}
						className='btn btn-outline border-primary/30 text-primary hover:bg-primary hover:text-white rounded-xl px-6 h-10 normal-case font-bold'
					>
						Add to List
					</button>
				</div>
			)}

			{isOwnProfile && isEditing && (
				<div className='mt-8 pt-6 border-t border-base-200/50 flex gap-3'>
					<button
						onClick={handleSave}
						className='btn btn-primary rounded-xl px-8 h-12 shadow-glow font-bold'
					>
						Save All Changes
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

export default ExperienceSection;
