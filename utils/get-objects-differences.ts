export default function getObjectDifferences<T extends Record<string, unknown>>(
	obj1: T,
	obj2: T
): Partial<T> {
	const differences: Partial<T> = {}

	for (const key in obj1) {
		if (obj1.hasOwnProperty(key)) {
			if (obj1[key] !== obj2[key]) {
				differences[key] = obj2[key]
			}
		}
	}

	return differences
}
