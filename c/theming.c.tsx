import {
	COLORS,
	ValidColorBases,
	ThemeColor,
	ThemeColorBase,
	ThemeColorVariant,
	ValidColorVariants,
} from "@/lib/theme";

function getInvertedColor(originalColor: ThemeColor) {
	const segs = originalColor.split("-");
	const base = segs.slice(0, -1).join("-") as ThemeColorBase;
	const num = segs.slice(-1)[0] as ThemeColorVariant;

	if (!ValidColorBases.includes(base)) {
		console.trace(`Color name invalid: Base '${base}' not found in ValidColorBases.`);
		return originalColor;
	}

	const offset = ValidColorVariants.indexOf(num);
	if (offset === -1) {
		console.trace(`Color variant invalid: Variant '${num}' not found in ValidColorVariants.`);
		return originalColor;
	}

	const inverseOffset = ValidColorVariants.length - 1 - offset;
	let workingTry = inverseOffset;
	if (!COLORS[`${base}-${ValidColorVariants[inverseOffset]}` as ThemeColor]) {
		console.trace(
			`COLORS[${base}-${ValidColorVariants[workingTry]}] doesn't exist, but is the inverse of "${originalColor}". Will attempt to compensate, but please fix.`
		);
	}
	while (
		// Try to save it but only if it's bad in the first place
		!COLORS[`${base}-${ValidColorVariants[workingTry]}` as ThemeColor] &&
		// Only loop if it's in range
		workingTry < ValidColorVariants.length &&
		workingTry >= 0
	) {
		if (offset > ValidColorVariants.length / 2) {
			workingTry--;
		} else {
			workingTry++;
		}
		if (workingTry < 0 || workingTry > ValidColorVariants.length - 1) {
			console.trace(`Cannot compensate for missing colors(!). Returning input.`);
			return originalColor;
		}
	}

	return COLORS[`${base}-${ValidColorVariants[inverseOffset]}` as ThemeColor];
}


/**
 * Runs on client, blocks render until run
 */
function __themeFunction() {
	const value = window.localStorage.getItem("color-mode");
	if (value) {
		if (value === "system") {
			document.documentElement.classList.remove("light", "dark");
		} else {
			document.documentElement.classList.add(value);
			document.documentElement.classList.remove(value === "light" ? "dark" : "light");
		}
	}
}
export function ThemeScript() {
	let clientThemeCode = `(${__themeFunction})()`;
	return (
		<script
			dangerouslySetInnerHTML={{
				__html: clientThemeCode,
			}}
		/>
	);
}
export function ThemeStyles() {
	return (
		<style>
			{`
				:root {
					--dark: 0, 0, 0;
					--light: 255, 255, 255;

					${Object.entries(COLORS)
						.map(([key, val]) => `--${key}: rgb(${val});`)
						.join("\n")}
					${Object.entries(COLORS)
						.map(([key, val]) => `--raw-${key}: ${val};`)
						.join("\n")}
				}
				:root.dark {
					--dark: 0, 0, 0;
					--light: 255, 255, 255;
					
					${Object.entries(COLORS)
						.map(([key, val]) => `--${key}: rgb(${val});`)
						.join("\n")}
					${Object.entries(COLORS)
						.map(([key, val]) => `--raw-${key}: ${val};`)
						.join("\n")}
				}
				:root.light {
					--dark: 255, 255, 255;
					--light: 0, 0, 0;
					
					${Object.entries(COLORS)
						.map(([key, val]) => `--${key}: rgb(${getInvertedColor(key as ThemeColor)});`)
						.join("\n")}
					${Object.entries(COLORS)
						.map(([key, val]) => `--raw-${key}: ${getInvertedColor(key as ThemeColor)};`)
						.join("\n")}
				}
				@media (prefers-color-scheme: light) {
					:root {
						--dark: 255, 255, 255;
						--light: 0, 0, 0;
						
						${Object.entries(COLORS)
							.map(([key]) => `--${key}: rgb(${getInvertedColor(key as ThemeColor)});`)
							.join("\n")}
						${Object.entries(COLORS)
							.map(([key]) => `--raw-${key}: ${getInvertedColor(key as ThemeColor)};`)
							.join("\n")}
					}
				}
			`}
		</style>
	);
}