import TablaUsuarios from "@/components/tabla-usuarios"
import modeloAdministrarUsuarios from "./modelo"

export default function VistaAdministrarUsuarios(usuarios: Awaited<ReturnType<typeof modeloAdministrarUsuarios.obtenerUsuarios>>) {
    return <TablaUsuarios users={usuarios} />
}