"use server";

import "./globals.css";
import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import LogoImg from "@/app/index.assets/hero/logo.png";
import { ThemeScript, ThemeStyles } from "@/c/theming.c";
import { COLORS } from "@/lib/theme";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});
const source_code_pro = Source_Code_Pro({
	subsets: ["latin"],
	variable: "--font-mono",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={[inter.variable, source_code_pro.variable].filter((e) => !!e).join(" ")}>
			{/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
			<head>
				<ThemeScript />
				<ThemeStyles />
			</head>
			<body>
				{children}
			</body>
		</html>
	);
}

export const metadata: Metadata = {
	title: {
		default: "Miza",
		template: "%s | Miza",
	},
	description: `The Multipurpose Discord Bot`,
	keywords: ["Discord", "Bot"],
	creator: "Thomas Xin",
	icons: {
		icon: LogoImg.src,
	},
	openGraph: {
		title: "Miza",
		description: "The Multipurpose Discord Bot",
		url: "https://mizabot.xyz",
		siteName: "Miza",
		/*
		images: [
			{
				url: "https://nextjs.org/og.png",
				width: 800,
				height: 600,
			},
			{
				url: "https://nextjs.org/og-alt.png",
				width: 1800,
				height: 1600,
				alt: "My custom alt",
			},
		],
*/
		locale: "en-US",
		type: "website",
	},
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: COLORS["purple-900"] },
		{ media: "(prefers-color-scheme: dark)", color: COLORS["purple-050"] },
	],
};
