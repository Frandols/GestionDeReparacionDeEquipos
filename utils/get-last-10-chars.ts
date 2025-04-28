export default function getLast10Chars(input: string): string {
	if (input.length >= 10) {
		return input.slice(-10)
	} else {
		return input.padStart(10, ' ')
	}
}
