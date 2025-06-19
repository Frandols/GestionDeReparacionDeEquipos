import { TipoDeEquipo } from "@/respositorios/tipoDeEquipo"

/**
 * Controlador para obtener todos los tipos de equipo.
 * Realiza una consulta a la base de datos y devuelve un JSON con la lista.
 * @param req Objeto Request de la petición HTTP.
 * @returns Response con la lista de tipos y status 200.
 */
export async function obtenerTipoDeEquipo(req: Request) {
  const tipoDeEquipos = await TipoDeEquipo.getAll()
  return new Response(JSON.stringify(tipoDeEquipos), { status: 200 })
}

/**
 * Controlador para crear un nuevo tipo de equipo.
 * Lee la descripción del body JSON, crea el nuevo tipo y lo guarda.
 * @param req Objeto Request con JSON que incluye 'descripcion'.
 * @returns Response con el nuevo tipo creado y status 201.
 */
export async function crearTipoDeEquipo(req: Request) {
  const { descripcion } = await req.json()
  const tipoDeEquipos = new TipoDeEquipo(descripcion)
  await tipoDeEquipos.save()
  return new Response(JSON.stringify(tipoDeEquipos), { status: 201 })
}