import { ThemeProvider } from '@/lib/theme.provider';
import Navbar from "@/c/navbar";

export default function NavbarLayout({ children }: { children: React.ReactNode }) {
	return (<>
		{/*
			ThemeProvider is only really needed for the themechange button in the navbar, so for now
			this is the way it is to reduce updates.
		*/}
		<ThemeProvider>
			<Navbar />
		</ThemeProvider>
		{children}
	</>);
}