import Navbar from "./Navbar";

const Layout = ({ children }) => {
	return (
		<div className='min-h-screen bg-base-100 transition-colors selection:bg-primary/20 selection:text-primary'>
			<Navbar />
			<div className='fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.03),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.03),transparent_40%)] pointer-events-none'></div>
			<main className='max-w-7xl mx-auto px-6 py-8 relative z-10'>{children}</main>
		</div>
	);
};

export default Layout;
