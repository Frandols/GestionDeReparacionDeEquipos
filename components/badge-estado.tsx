import { Badge } from "./ui/badge"

const clasesDeEstados: Record<string, string> = {
    'Pendiente de revisión': 'bg-yellow-100 border-yellow-600 text-orange-400',
    'En revisión': 'bg-blue-100 border-blue-600 text-blue-600',
    'Pendiente de presupuesto': 'bg-yellow-100 border-yellow-600 text-orange-400',
    'Pendiente de aprobacion de presupuesto': 'bg-yellow-100 border-yellow-600 text-orange-400',
    'Pendiente de reparación': 'bg-yellow-100 border-yellow-600 text-orange-400',
    'En reparación': 'bg-blue-100 border-blue-600 text-blue-600',
    'Pendiente de entrega': 'bg-yellow-100 border-yellow-600 text-orange-400',
    'Entregado': 'bg-green-100 border-green-600 text-green-600'
}

export default function BadgeEstado(props: { estado: string }) {
    return <Badge className={clasesDeEstados[props.estado]}>{props.estado}</Badge>
}