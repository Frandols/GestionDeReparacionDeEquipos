export default function formatearFecha(date: Date) {
	const fecha = new Date(date)

	const fechaFormateada = new Intl.DateTimeFormat('es-AR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}).format(fecha)

	return fechaFormateada
}
