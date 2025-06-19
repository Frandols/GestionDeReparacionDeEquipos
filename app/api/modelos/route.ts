import { obtenerModelos, crearModelo } from "@/recursos/modelos/controlador";



/**
 * Handler para la solicitud GET, devuelve la lista de modelos.
 * @param req - Objeto Request de la solicitud HTTP.
 * @returns Respuesta con la lista de modelos en formato JSON.
 */
export async function GET(req: Request) {
    return obtenerModelos(req)
}

/**
 * Handler para la solicitud POST, crea un nuevo modelo.
 * @param req - Objeto Request con los datos del nuevo modelo en el cuerpo.
 * @returns Respuesta con el modelo creado en formato JSON.
 */
export async function POST(req: Request) {
    return crearModelo(req)
}
