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
export type ThemeColorValue = `${number}, ${number}, ${number}`;

export const COLORS: Record<ThemeColor, ThemeColorValue> = {
	"purple-050": "234, 226, 248",
	"purple-100": "207, 188, 242",
	"purple-200": "160, 129, 217",
	"purple-300": "134, 98, 199",
	"purple-400": "114, 75, 183",
	"purple-500": "101, 60, 173",
	"purple-600": "81, 39, 155",
	"purple-700": "52, 18, 111",
	"purple-800": "21, 1, 53",
	"purple-900": "11, 1, 28",
	"red-050": "255, 227, 227",
	"red-100": "255, 189, 189",
	"red-200": "255, 155, 155",
	"red-300": "248, 106, 106",
	"red-400": "239, 78, 78",
	"red-500": "225, 45, 57",
	"red-600": "207, 17, 36",
	"red-700": "171, 9, 30",
	"red-800": "138, 4, 26",
	"red-900": "97, 3, 22",
	"blue-050": "240, 244, 248",
	"blue-100": "217, 226, 236",
	"blue-200": "188, 204, 220",
	"blue-300": "159, 179, 200",
	"blue-400": "130, 154, 177",
	"blue-500": "98, 125, 152",
	"blue-600": "72, 101, 129",
	"blue-700": "51, 78, 104",
	"blue-800": "36, 59, 83",
	"blue-900": "16, 42, 67",
	"teal-050": "240, 252, 249",
	"teal-100": "198, 247, 233",
	"teal-200": "142, 237, 209",
	"teal-300": "95, 227, 192",
	"teal-400": "45, 204, 167",
	"teal-500": "23, 184, 151",
	"teal-600": "7, 154, 130",
	"teal-700": "4, 130, 113",
	"teal-800": "1, 100, 87",
	"teal-900": "0, 68, 64",
	"yellow-050": "255, 251, 234",
	"yellow-100": "255, 243, 196",
	"yellow-200": "252, 229, 136",
	"yellow-300": "250, 219, 95",
	"yellow-400": "247, 201, 72",
	"yellow-500": "240, 180, 41",
	"yellow-600": "222, 145, 29",
	"yellow-700": "203, 110, 23",
	"yellow-800": "180, 77, 18",
	"yellow-900": "141, 43, 11",
	"gray-050": "244, 242, 246",
	"gray-100": "233, 229, 238",
	"gray-200": "212, 204, 221",
	"gray-300": "190, 178, 204",
	"gray-400": "169, 153, 188",
	"gray-500": "142, 127, 159",
	"gray-600": "120, 102, 140",
	"gray-700": "71, 51, 93",
	"gray-800": "46, 33, 60",
	"gray-900": "22, 12, 34"
};

export type ThemeColorVarName = `${ThemeColorBase}_${ThemeColorVariant}`;
export type ThemeColorRawVarName = `raw_${ThemeColorBase}_${ThemeColorVariant}`;
export const ThemeVars = Object.fromEntries([
	...Object.entries(COLORS).map(
		([key, val]) => ([
			key.split('-').join('_'),
			`rgb(var(--${key}, ${val}))`
		])
	),
	...Object.entries(COLORS).map(
		([key, val]) => ([
			'raw_' + key.split('-').join('_'),
			`var(--raw-${key}, ${val})`
		])
	)
]) as Record<ThemeColorVarName | ThemeColorRawVarName, string>;