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

	const formateada = new Intl.DateTimeFormat('es-ES', options).format(fecha)

	const resultado = formateada.charAt(0).toUpperCase() + formateada.slice(1)

	return resultado
}
