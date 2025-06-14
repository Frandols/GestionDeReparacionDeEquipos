import { Marca } from "@/respositorios/marcas"

/**
 * Controlador para obtener todas las marcas.
 * Invoca el método estático getAll de la clase Marca y devuelve el listado en formato JSON.
 * 
 * @param {Request} req - Objeto de la petición HTTP.
 * @returns {Response} Respuesta HTTP con código 200 y la lista de marcas en JSON.
 */
export async function obtenerMarcas(req: Request) {
  const marcas = await Marca.getAll()
  return new Response(JSON.stringify(marcas), { status: 200 })
}

/**
 * Controlador para crear una nueva marca.
 * Obtiene la descripción desde el cuerpo de la petición, crea y guarda una nueva instancia de Marca, y responde con el objeto creado.
 * 
 * @param {Request} req - Objeto de la petición HTTP.
 * @returns {Response} Respuesta HTTP con código 201 y la marca creada en JSON.
 */
export async function crearMarca(req: Request) {
  const { descripcion } = await req.json()
  const marca = new Marca(descripcion)
  await marca.save()
  return new Response(JSON.stringify(marca), { status: 201 })
}
