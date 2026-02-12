import Navbar from "./Navbar";

const Layout = ({ children }) => {
	return (
		<div className='min-h-screen bg-gradient-to-b from-base-100 via-base-100 to-sky-50 dark:to-slate-900 transition-colors'>
			<Navbar />
			<main className='max-w-7xl mx-auto px-4 py-6'>{children}</main>
		</div>
	);
};

export default Layout;
