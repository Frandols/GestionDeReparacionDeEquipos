import { obtenerMarcas, crearMarca } from "@/recursos/marcas/controlador";


export async function GET(req: Request) {
    return obtenerMarcas(req)
}

export async function POST(req: Request) {
    return crearMarca(req)
}
