"use client";

import { createContext, FC, ReactNode, useEffect, useMemo, useState } from "react";

// Stolen entirely from https://www.joshwcomeau.com/react/dark-mode/
function browser_only__getInitialColorMode(): ColorMode {
	const persistedColorPreference = window.localStorage.getItem("color-mode");
	const hasPersistedPreference = typeof persistedColorPreference === "string";

	// If the user has explicitly chosen light or dark,
	// let's use it. Otherwise, this value will be null.
	if (typeof hasPersistedPreference !== "undefined") {
		if (["light", "dark", "system"].includes(persistedColorPreference!)) {
			return persistedColorPreference as BrowserColorMode;
		} else {
			if (process.env.NODE_ENV === "development") {
				console.trace(
					`...How did we get here? Color preference is unexpected value "${persistedColorPreference}". Yeeting it.`
				)
			}
			window.localStorage.removeItem("color-mode");
			return null;
		}
	}
	// If they haven't been explicit, let's check the media
	// query
	const mql = window.matchMedia("(prefers-color-scheme: dark)");
	const hasMediaQueryPreference = typeof mql.matches === "boolean";
	if (hasMediaQueryPreference) {
		return mql.matches ? "dark" : "light";
	}
	// If they are using a browser/OS that doesn't support
	// color themes, let's default to 'dark'.
	return "dark";
}

/**
 * Light, Dark, System: self-explanatory.
 * null: _not a browser_. Don't render yet!
 */
export type ColorMode = "light" | "dark" | "system" | null;
export type BrowserColorMode = Exclude<ColorMode, null>;


type ThemeContextValue = {
	colorMode: ColorMode;
	setColorMode: (value: BrowserColorMode) => void;
};


export const ThemeContext = createContext<ThemeContextValue>({
	colorMode: null,
	setColorMode: (_: BrowserColorMode) => {
		if (process.env.NODE_ENV === "development") {
			console.trace(`Something smells here. This function shouldn't be called yet!`);
		}
	},
});

export const ThemeProvider: FC<{
	children: ReactNode;
}> = ({ children }) => {
	const [colorMode, rawSetColorMode] = useState<ColorMode>(null);
	useEffect(() => {
		rawSetColorMode(browser_only__getInitialColorMode());
	}, [])
	const setColorMode = (value: BrowserColorMode) => {
		rawSetColorMode(value);
		// Persist it on update
		window.localStorage.setItem("color-mode", value);
		if (value === "system") {
			document.documentElement.classList.remove("light", "dark");
		} else {
			document.documentElement.classList.add(value);
			document.documentElement.classList.remove(value === "light" ? "dark" : "light");
		}
	};

	const memoValue = useMemo(() => {
		return {
			colorMode,
			setColorMode,
		};
	}, [colorMode, setColorMode]);

	return <ThemeContext.Provider value={memoValue}>{children}</ThemeContext.Provider>;
};
