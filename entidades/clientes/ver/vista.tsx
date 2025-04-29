import TablaClientes from "@/components/tabla-clientes";
import modeloVerClientes from "./modelo";

export default function VistaVerClientes(clientes: Awaited<ReturnType<typeof modeloVerClientes.obtenerClientes>>) {
    return <TablaClientes showActions={false} clientes={clientes} />
}