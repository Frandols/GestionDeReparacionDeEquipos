import { Client } from '@/respositorios/client'
import { Equipo } from '@/respositorios/equipo'
import { Marca } from '@/respositorios/marcas'
import { MetodoDePago } from '@/respositorios/metodosDePago'
import { Modelo } from '@/respositorios/modelos'
import { TipoDeEquipo } from '@/respositorios/tipoDeEquipo'
import VistaVerEquipos from './vista'

export default async function ControladorVerEquipos() {
    const equipos = await Equipo.getAll()
    const clientes = await Client.getAll()
    const tiposDeEquipo = await TipoDeEquipo.getAll()
    const marcas = await Marca.getAll()
    const modelos = await Modelo.getAll()
    const metodosDePago = await MetodoDePago.getAll()

    return VistaVerEquipos(
        equipos,
        clientes,
        tiposDeEquipo,
        marcas,
        modelos,
        metodosDePago
    )
}
