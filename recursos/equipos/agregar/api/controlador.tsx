import Equipo from "../../modelo";

/**
 * Controlador para obtener todos los equipos que no están eliminados.
 * Llama al método estático getAll de la clase Equipo y devuelve la lista en JSON.
 * 
 * @param {Request} req - Objeto de la petición HTTP.
 * @returns {Response} Respuesta HTTP con código 200 y lista de equipos en JSON.
 */
export async function obtenerEquipos() {
  const { equipos } = await Equipo.buscarEquipos();

  return new Response(JSON.stringify(equipos), { status: 200 });
}


/**
 * Controlador para crear un nuevo equipo.
 * Obtiene los datos del cuerpo de la petición, crea una instancia de Equipo y la guarda en la base de datos.
 * 
 * @param {Request} req - Objeto de la petición HTTP.
 * @returns {Response} Respuesta HTTP con código 201 y el equipo creado en JSON.
 */
export async function crearEquipo(req: Request) {
  const {
    idCliente,
    nroSerie,
    idMarca,
    idModelo,
    razonDeIngreso,
    observaciones,
    enciende,
    idTipoDeEquipo,
  } = await req.json();

  const esValido = await Equipo.verificarDatosEquipo({
      idCliente,
      nroSerie,
      idMarca,
      idModelo,
      razonDeIngreso,
      observaciones,
      enciende,
      idTipoDeEquipo,
      deleted: false
    })

  if(!esValido) throw new Error('Los datos del equipo no son validos')

  const equipo = await Equipo.crearEquipo({
    idCliente,
    nroSerie,
    idMarca,
    idModelo,
    razonDeIngreso,
    observaciones,
    enciende,
    idTipoDeEquipo,
    deleted: false
  })

  return new Response(JSON.stringify(equipo), { status: 201 });
}


/**
 * Controlador para actualizar un equipo existente.
 * Extrae el ID y los datos a actualizar del cuerpo de la petición, crea una instancia de Equipo y llama a su método update.
 * Devuelve el equipo actualizado.
 * 
 * @param {Request} req - Objeto de la petición HTTP.
 * @returns {Response} Respuesta HTTP con código 200 y el equipo actualizado en JSON.
 */
export async function actualizarEquipo(req: Request) {
  const { id, ...data } = await req.json();

  if (!id) return new Response('ID requerido para actualizar', { status: 400 });

  await Equipo.actualizarEquipo(id, data)

  return new Response(JSON.stringify({ ...data, id }), { status: 200 });
}


/**
 * Controlador para eliminar (marcar como eliminado) un equipo.
 * Obtiene el ID del cuerpo de la petición, crea una instancia de Equipo y llama a su método delete.
 * Devuelve respuesta con código 204 sin contenido.
 * 
 * @param {Request} req - Objeto de la petición HTTP.
 * @returns {Response} Respuesta HTTP con código 204 (sin contenido).
 */
export async function eliminarEquipo(req: Request) {
  const { id } = await req.json();

  if (!id) return new Response('ID requerido para eliminar', { status: 400 });

  await Equipo.eliminarEquipo(id)

  return new Response(null, { status: 204 });
}
