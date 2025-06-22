import TablaUsuarios from "@/components/tabla-usuarios"
import Usuario from "../modelo"

export default function VistaAdministrarUsuarios(usuarios: Awaited<ReturnType<typeof Usuario.obtenerUsuarios>>) {
    return <TablaUsuarios users={usuarios} />
}