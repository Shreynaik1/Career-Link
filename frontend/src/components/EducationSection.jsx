import { School, X } from "lucide-react";
import { useState, useEffect } from "react";

const EducationSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [educations, setEducations] = useState(Array.isArray(userData?.education) ? userData.education : []);
	const [newEducation, setNewEducation] = useState({
		school: "",
		fieldOfStudy: "",
		startYear: "",
		endYear: "",
	});

	useEffect(() => {
		if (Array.isArray(userData?.education)) {
			setEducations(userData.education);
		}
	}, [userData?.education]);

	const handleAddEducation = () => {
		if (newEducation.school && newEducation.fieldOfStudy && newEducation.startYear) {
			setEducations([...educations, newEducation]);
			setNewEducation({
				school: "",
				fieldOfStudy: "",
				startYear: "",
				endYear: "",
			});
		}
	};

	const handleDeleteEducation = (id) => {
		setEducations(educations.filter((edu) => (edu._id || edu.school) !== id));
	};

	const handleSave = () => {
		onSave({ education: educations });
		setIsEditing(false);
	};

	return (
		<div className='glass-card rounded-3xl p-8 mb-8 hover-lift border-base-200/50'>
			<div className='flex items-center justify-between mb-8'>
				<h2 className='text-2xl font-bold text-neutral font-["Outfit"]'>Education</h2>
				{isOwnProfile && !isEditing && (
					<button
						onClick={() => setIsEditing(true)}
						className='text-primary hover:bg-primary/5 px-4 py-1.5 rounded-xl font-bold text-sm premium-transition'
					>
						Edit Education
					</button>
				)}
			</div>

			<div className='space-y-8'>
				{educations.map((edu, index) => (
					<div key={edu._id || index} className='flex gap-6 group'>
						<div className='size-14 bg-base-200/50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 premium-transition'>
							<School size={24} className='text-neutral/40 group-hover:text-primary premium-transition' />
						</div>
						
						<div className='flex-1 flex justify-between items-start'>
							<div>
								<h3 className='font-bold text-lg text-neutral leading-tight'>{edu.fieldOfStudy}</h3>
								<p className='text-neutral/60 font-semibold text-[15px] mt-1'>{edu.school}</p>
								<p className='text-neutral/40 font-bold text-[11px] uppercase tracking-wider mt-2 bg-base-100 inline-block px-2 py-0.5 rounded-md'>
									{edu.startYear} — {edu.endYear || "Present"}
								</p>
							</div>
							
							{isEditing && (
								<button 
									onClick={() => handleDeleteEducation(edu._id || edu.school)} 
									className='p-2 text-neutral/20 hover:text-error hover:bg-error/5 rounded-xl premium-transition'
								>
									<X size={20} />
								</button>
							)}
						</div>
					</div>
				))}
			</div>

			{isEditing && (
				<div className='mt-12 p-6 bg-base-100/50 rounded-2xl border border-base-200/50 space-y-4'>
					<h3 className='font-bold text-sm text-neutral/40 uppercase tracking-widest mb-2'>Add New Education</h3>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<input
							type='text'
							placeholder='Field of Study'
							value={newEducation.fieldOfStudy}
							onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })}
							className='input-premium w-full rounded-xl h-11 px-4 text-sm'
						/>
						<input
							type='text'
							placeholder='School / University'
							value={newEducation.school}
							onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
							className='input-premium w-full rounded-xl h-11 px-4 text-sm'
						/>
					</div>
					
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<input
							type='number'
							placeholder='Start Year'
							value={newEducation.startYear}
							onChange={(e) => setNewEducation({ ...newEducation, startYear: e.target.value })}
							className='input-premium w-full rounded-xl h-11 px-4 text-sm'
						/>
						<input
							type='number'
							placeholder='End Year (Expected)'
							value={newEducation.endYear}
							onChange={(e) => setNewEducation({ ...newEducation, endYear: e.target.value })}
							className='input-premium w-full rounded-xl h-11 px-4 text-sm'
						/>
					</div>
					
					<button
						onClick={handleAddEducation}
						className='btn btn-outline border-primary/30 text-primary hover:bg-primary hover:text-white rounded-xl px-6 h-10 normal-case font-bold'
					>
						Add Education
					</button>
				</div>
			)}

			{isOwnProfile && isEditing && (
				<div className='mt-8 pt-6 border-t border-base-200/50 flex gap-3'>
					<button
						onClick={handleSave}
						className='btn btn-primary rounded-xl px-8 h-12 shadow-glow font-bold'
					>
						Save Changes
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

export default EducationSection;
