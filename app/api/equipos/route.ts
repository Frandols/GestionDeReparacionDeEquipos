import {
	actualizarEquipo,
	crearEquipo,
	eliminarEquipo,
	obtenerEquipos,
} from '@/recursos/equipos/agregar/api/controlador'

/**
 * Handler para la solicitud GET que obtiene todos los equipos.
 * @param req - Objeto Request de la petición HTTP.
 * @returns Respuesta con el listado de equipos en formato JSON.
 */
export async function GET() {
	return obtenerEquipos()
}

/**
 * Handler para la solicitud POST que crea un nuevo equipo.
 * @param req - Objeto Request que contiene los datos del nuevo equipo en el cuerpo.
 * @returns Respuesta con el equipo creado en formato JSON.
 */
export async function POST(req: Request) {
	return crearEquipo(req)
}

/**
 * Handler para la solicitud PUT que actualiza un equipo existente.
 * @param req - Objeto Request con los datos actualizados y el ID del equipo.
 * @returns Respuesta con el equipo actualizado en formato JSON.
 */
export async function PUT(req: Request) {
	return actualizarEquipo(req)
}

/**
 * Handler para la solicitud DELETE que marca un equipo como eliminado.
 * @param req - Objeto Request que contiene el ID del equipo a eliminar.
 * @returns Respuesta con estado 204 sin contenido.
 */
export async function DELETE(req: Request) {
	return eliminarEquipo(req)
}
