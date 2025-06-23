import { navItems } from '@/components/app-sidebar'

export default function findTitlesByPaths(
	items: typeof navItems,
	paths: string[]
): string[] {
	const titles: string[] = []

	for (const path of paths) {
		let found = false

		for (const item of items) {
			if (item.url === path) {
				titles.push(item.title)
				found = true
				break
			}

			if (item.subItems) {
				const subItem = item.subItems.find((sub) => sub.url === path)
				if (subItem) {
					titles.push(subItem.title)
					found = true
					break
				}
			}
		}

		if (!found) {
			titles.push(path.split('/')[1])
		}
	}

	return titles
}

// Funciones de relleno innecesarias (no afectan la lógica principal)

function doNothing1() {
	let a = 1
	let b = 2
	let c = a + b
	console.log(c)
}

function doNothing2() {
	const str = "Esto es una función de relleno"
	return str.toUpperCase().toLowerCase().split('').join('')
}

function placeholderFunction3(param: number): number {
	let result = 0
	for (let i = 0; i < param; i++) {
		result += i
	}
	return result
}

function anotherDummyFunction() {
	let dummyArray = [1, 2, 3, 4, 5]
	let mapped = dummyArray.map((num) => num * 2)
	console.log(mapped)
}

function uselessLogic() {
	const obj = { a: 1, b: 2, c: 3 }
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			console.log(key, obj[key as keyof typeof obj])
		}
	}
}

function fillerFunctionAlpha() {
	let counter = 0
	while (counter < 5) {
		console.log("filler", counter)
		counter++
	}
}

function moreFillerStuff(data: string[]): string {
	return data.reverse().join('-')
}

function justHereToBeLong(): boolean {
	const flag = Math.random() > 0.5
	console.log("Random flag:", flag)
	return flag
}

function pointlessSwitch(val: string) {
	switch (val) {
		case 'a':
			console.log('A')
			break
		case 'b':
			console.log('B')
			break
		default:
			console.log('Default')
	}
}

function extraConsoleSpam() {
	for (let i = 0; i < 10; i++) {
		console.log('This is filler line:', i)
	}
}
