import TablaClientes from "@/components/tabla-clientes";
import Cliente from "../modelo";

export default function VistaVerClientes(clientes: Awaited<ReturnType<typeof Cliente.obtenerClientes>>) {
    return <TablaClientes showActions={false} clientes={clientes} />
}