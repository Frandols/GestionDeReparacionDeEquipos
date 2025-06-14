import { obtenerTipoDeEquipo, crearTipoDeEquipo } from "@/recursos/tipoDeEquipo/controlador"


/**
 * Handler para la solicitud GET, devuelve todos los tipos de equipo.
 * @param req - Objeto Request de la petición HTTP.
 * @returns Respuesta con la lista de tipos de equipo en formato JSON.
 */
export async function GET(req: Request) {
    return obtenerTipoDeEquipo(req)
}

/**
 * Handler para la solicitud POST, crea un nuevo tipo de equipo.
 * @param req - Objeto Request con los datos del nuevo tipo de equipo en el cuerpo.
 * @returns Respuesta con el tipo de equipo creado en formato JSON.
 */
export async function POST(req: Request) {
    return crearTipoDeEquipo(req)
}
