import TablaUsuarios from "@/components/tabla-usuarios";
import { obtenerUsuarios } from "./actions/obtenerUsuarios";

export default async function AdministrarUsuariosPage() {
    const users = await obtenerUsuarios()

    return <TablaUsuarios users={users} />
}