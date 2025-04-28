export default function getCurrentDateForToast() {
	const fecha = new Date()

	const options: Intl.DateTimeFormatOptions = {
		weekday: 'long', // Día de la semana
		year: 'numeric', // Año
		month: 'long', // Mes
		day: '2-digit', // Día
		hour: '2-digit', // Hora
		minute: '2-digit', // Minuto
		hour12: true, // Formato de 12 horas (AM/PM)
	}

	const formateada = new Intl.DateTimeFormat('en-US', options).format(fecha)

	return formateada.replace(',', ' at')
}
