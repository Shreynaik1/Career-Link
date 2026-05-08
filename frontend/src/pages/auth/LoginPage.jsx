import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
	return (
		<div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<img className='mx-auto h-20 w-auto rounded-2xl shadow-premium mb-6' src='/small-logo.png' alt='Career Link' />
				<h2 className='text-center text-3xl font-bold text-neutral font-["Outfit"] tracking-tight'>Welcome back</h2>
				<p className='text-center text-neutral/40 text-sm mt-2 font-medium'>Sign in to continue your professional journey</p>
			</div>

			<div className='mt-10 sm:mx-auto sm:w-full sm:max-w-md'>
				<div className='glass-card py-10 px-8 sm:rounded-3xl shadow-premium'>
					<LoginForm />
					<div className='mt-8'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-base-200'></div>
							</div>
							<div className='relative flex justify-center text-[11px] font-bold uppercase tracking-widest'>
								<span className='px-4 bg-white text-neutral/30'>New to CareerLink?</span>
							</div>
						</div>
						<div className='mt-8'>
							<Link
								to='/signup'
								className='w-full flex justify-center py-3 px-4 border-2 border-primary/10 rounded-2xl text-sm font-bold text-primary bg-white hover:bg-primary/5 hover:border-primary/20 premium-transition'
							>
								Create an account
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;
