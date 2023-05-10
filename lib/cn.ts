export default function cn(...args: (string | boolean | null | undefined)[]): string {
	return args.filter(e => (typeof e === 'string')).join(' ');
}