export function pad(number: number, length: number = 2): string {
	return ('' + number).padStart(length, '0');
}