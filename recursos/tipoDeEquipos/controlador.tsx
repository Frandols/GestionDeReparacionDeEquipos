import { TipoDeEquipo} from "@/respositorios/tipoDeEquipo"

export async function obtenerTipoDeEquipo(req: Request) {
  const tipoDeEquipos = await TipoDeEquipo.getAll()
  return new Response(JSON.stringify(tipoDeEquipos), { status: 200 })
}

export async function crearTipoDeEquipo(req: Request) {
  const { descripcion } = await req.json()
  const tipoDeEquipos = new TipoDeEquipo(descripcion)
  await tipoDeEquipos.save()
  return new Response(JSON.stringify(tipoDeEquipos), { status: 201 })
}