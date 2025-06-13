import { obtenerModelos, crearModelo } from "@/recursos/modelos/controlador";


export async function GET(req: Request) {
    return obtenerModelos(req)
}

export async function POST(req: Request) {
    return crearModelo(req)
}
