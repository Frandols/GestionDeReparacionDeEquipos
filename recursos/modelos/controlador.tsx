import { Modelo } from "@/respositorios/modelos"

export async function obtenerModelos(req: Request) {
  const modelos = await Modelo.getAll()
  return new Response(JSON.stringify(modelos), { status: 200 })
}

export async function crearModelo(req: Request) {
  const { descripcion } = await req.json()
  const modelo = new Modelo(descripcion)
  await modelo.save()
  return new Response(JSON.stringify(modelo), { status: 201 })
}