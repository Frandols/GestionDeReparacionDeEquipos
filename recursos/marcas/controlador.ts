import { Marca } from "@/respositorios/marcas"

export async function obtenerMarcas(req: Request) {
  const marcas = await Marca.getAll()
  return new Response(JSON.stringify(marcas), { status: 200 })
}

export async function crearMarca(req: Request) {
  const { descripcion } = await req.json()
  const marca = new Marca(descripcion)
  await marca.save()
  return new Response(JSON.stringify(marca), { status: 201 })
}