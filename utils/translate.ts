const knownErrors = {
	form_identifier_exists: {
		email_address: 'El email ingresado ya esta en uso',
		username: 'El nombre de usuario ya esta en uso',
		phone_number: 'El numero de telefono ya esta en uso',
		DNI: 'El DNI ya esta en uso',
	},
}

const defaultMessage = 'Error desconocido'

export default function translate(code: string, param: string) {
	if (!(code in knownErrors)) return defaultMessage

	const error = knownErrors[code as keyof typeof knownErrors]

	if (!(param in error)) return defaultMessage

	const message = error[param as keyof typeof error]

	return message
}
