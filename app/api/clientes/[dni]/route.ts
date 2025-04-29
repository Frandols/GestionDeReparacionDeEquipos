import {
	ControladorEliminarCliente,
	ControladorModificarCliente,
	ControladorObtenerCliente,
	ControladorRestaurarCliente,
} from '@/recursos/clientes/administrar/api/porDni/controlador'

export const GET = ControladorObtenerCliente

export const DELETE = ControladorEliminarCliente

export const PATCH = ControladorRestaurarCliente

export const PUT = ControladorModificarCliente
