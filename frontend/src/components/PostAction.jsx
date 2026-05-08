export default function PostAction({ icon, text, onClick, badge, active }) {
	return (
		<button 
			className={`flex items-center gap-2 px-3 py-2 rounded-xl premium-transition group relative
				${active ? 'text-primary bg-primary/5' : 'text-neutral/60 hover:text-primary hover:bg-primary/5'}`} 
			onClick={onClick}
		>
			<span className='group-hover:scale-110 premium-transition'>{icon}</span>
			<span className='hidden sm:inline font-bold text-xs uppercase tracking-wider'>{text}</span>
			{badge && (
				<span className='bg-base-300 text-neutral text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[18px] text-center'>
					{badge}
				</span>
			)}
		</button>
	);
}
