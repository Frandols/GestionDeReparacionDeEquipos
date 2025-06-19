import { Client } from '@/respositorios/client'
import { Equipo } from '@/respositorios/equipo'
import { Marca } from '@/respositorios/marcas'
import { Modelo } from '@/respositorios/modelos'
import { TipoDeEquipo } from '@/respositorios/tipoDeEquipo'
import VistaAdministrarEquipos from './vista'

export default async function ControladorAdministrarEquipos() {
	const equipos = await Equipo.getAll()
	const clientes = await Client.getAll()
	const tiposDeEquipo = await TipoDeEquipo.getAll()
	const marcas = await Marca.getAll()
	const modelos = await Modelo.getAll()

	return VistaAdministrarEquipos(
		equipos,
		clientes,
		tiposDeEquipo,
		marcas,
		modelos
	)
}
