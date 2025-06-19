import { Modelo } from "@/respositorios/modelos"

/**
 * Controlador que maneja la petición para obtener todos los modelos.
 * Llama al método estático getAll del modelo Modelo y responde con el listado en JSON.
 * 
 * @param {Request} req - Objeto Request de la petición HTTP.
 * @returns {Response} Respuesta HTTP con status 200 y el array de modelos en JSON.
 */
export async function obtenerModelos(req: Request) {
  const modelos = await Modelo.getAll()
  return new Response(JSON.stringify(modelos), { status: 200 })
}

/**
 * Controlador que maneja la petición para crear un nuevo modelo.
 * Extrae la descripción del cuerpo de la petición, crea una instancia de Modelo, la guarda en DB y responde con el objeto creado.
 * 
 * @param {Request} req - Objeto Request de la petición HTTP.
 * @returns {Response} Respuesta HTTP con status 201 y el modelo creado en JSON.
 */
export async function crearModelo(req: Request) {
  const { descripcion } = await req.json()
  const modelo = new Modelo(descripcion)
  await modelo.save()
  return new Response(JSON.stringify(modelo), { status: 201 })
}
