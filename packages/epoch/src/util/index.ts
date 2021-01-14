export function makeString(length: number) {
	let result = ''
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	const charactersLength = characters.length
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	return result
}

export const hashCode = (s: string) => {
	let h = 0,
		i = 0

	const l = s.length
	if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0
	return h
}
