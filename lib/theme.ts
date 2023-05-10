export type ThemeColorVariant =  typeof ValidColorVariants[number];

export type ThemeColorBase = typeof ValidColorBases[number];
export const ValidColorBases = [
	"purple",
	"red",
	"blue",
	"teal",
	"yellow",
	"gray"
] as const;

export const ValidColorVariants = [
	'050',
	'100',
	'200',
	'300',
	'400',
	'500',
	'600',
	'700',
	'800',
	'900'
] as const;

export type ThemeColor = `${ThemeColorBase}-${ThemeColorVariant}`;

export const COLORS: Record<ThemeColor, string> = {
	// Primary
	"purple-050": "#EAE2F8",
	"purple-100": "#CFBCF2",
	"purple-200": "#A081D9",
	"purple-300": "#8662C7",
	"purple-400": "#724BB7",
	"purple-500": "#653CAD",
	"purple-600": "#51279B",
	"purple-700": "#34126F",
	"purple-800": "#150135",
	"purple-900": "#0b011c",

	"red-050": "#FFE3E3",
	"red-100": "#FFBDBD",
	"red-200": "#FF9B9B",
	"red-300": "#F86A6A",
	"red-400": "#EF4E4E",
	"red-500": "#E12D39",
	"red-600": "#CF1124",
	"red-700": "#AB091E",
	"red-800": "#8A041A",
	"red-900": "#610316",

	// Neutrals
	"blue-050": "#F0F4F8",
	"blue-100": "#D9E2EC",
	"blue-200": "#BCCCDC",
	"blue-300": "#9FB3C8",
	"blue-400": "#829AB1",
	"blue-500": "#627D98",
	"blue-600": "#486581",
	"blue-700": "#334E68",
	"blue-800": "#243B53",
	"blue-900": "#102A43",

	// Supporting
	"teal-050": "#F0FCF9",
	"teal-100": "#C6F7E9",
	"teal-200": "#8EEDD1",
	"teal-300": "#5FE3C0",
	"teal-400": "#2DCCA7",
	"teal-500": "#17B897",
	"teal-600": "#079A82",
	"teal-700": "#048271",
	"teal-800": "#016457",
	"teal-900": "#004440",

	"yellow-050": "#FFFBEA",
	"yellow-100": "#FFF3C4",
	"yellow-200": "#FCE588",
	"yellow-300": "#FADB5F",
	"yellow-400": "#F7C948",
	"yellow-500": "#F0B429",
	"yellow-600": "#DE911D",
	"yellow-700": "#CB6E17",
	"yellow-800": "#B44D12",
	"yellow-900": "#8D2B0B",

	"gray-050": "#f4f2f6",
	"gray-100": "#e9e5ee",
	"gray-200": "#d4ccdd",
	"gray-300": "#beb2cc",
	"gray-400": "#a999bc",
	"gray-500": "#8e7f9f",
	"gray-600": "#78668c",
	"gray-700": "#47335d",
	"gray-800": "#2e213c",
	"gray-900": "#160c22",
};

export type ThemeColorVarName = `${ThemeColorBase}_${ThemeColorVariant}`;
export const ThemeVars = Object.fromEntries(
	Object.entries(COLORS).map(
		([key, val]) => ([
			key.split('-').join('_'),
			`var(--${key}, ${val})`
		])
	)
) as Record<ThemeColorVarName, string>;