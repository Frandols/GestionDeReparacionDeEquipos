import { obtenerMarcas, crearMarca } from "@/recursos/marcas/controlador";



/**
 * Handler para la solicitud GET, retorna todas las marcas registradas.
 * @param req - Objeto Request de la petición HTTP.
 * @returns Respuesta con el listado de marcas en formato JSON.
 */
export async function GET(req: Request) {
    return obtenerMarcas(req)
}

/**
 * Handler para la solicitud POST, crea una nueva marca.
 * @param req - Objeto Request que contiene la información de la nueva marca en el cuerpo.
 * @returns Respuesta con la marca creada en formato JSON.
 */
export async function POST(req: Request) {
    return crearMarca(req)
}
