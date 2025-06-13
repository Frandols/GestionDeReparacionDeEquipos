import { obtenerTipoDeEquipo, crearTipoDeEquipo } from "@/recursos/tipoDeEquipos/controlador"


export async function GET(req: Request) {
    return obtenerTipoDeEquipo(req)
}

export async function POST(req: Request) {
    return crearTipoDeEquipo(req)
}
