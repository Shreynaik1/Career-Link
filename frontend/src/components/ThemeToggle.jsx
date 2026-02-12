import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const THEME_KEY = "careerlink-theme";
const LIGHT_THEME = "careerlink";
const DARK_THEME = "careerlinkDark";

const ThemeToggle = () => {
	const [theme, setTheme] = useState(LIGHT_THEME);

	useEffect(() => {
		const storedTheme = localStorage.getItem(THEME_KEY);
		const initialTheme = storedTheme === DARK_THEME ? DARK_THEME : LIGHT_THEME;
		setTheme(initialTheme);
		document.documentElement.setAttribute("data-theme", initialTheme);
	}, []);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem(THEME_KEY, theme);
	}, [theme]);

	const isDark = theme === DARK_THEME;

	return (
		<button
			type='button'
			onClick={() => setTheme(isDark ? LIGHT_THEME : DARK_THEME)}
			className='btn btn-ghost btn-circle border border-base-300/70 bg-secondary/70 backdrop-blur-sm hover:bg-base-100 transition-colors'
			aria-label='Toggle theme'
		>
			{isDark ? (
				<Sun size={18} className='text-yellow-400' />
			) : (
				<Moon size={18} className='text-sky-600' />
			)}
		</button>
	);
};

export default ThemeToggle;

