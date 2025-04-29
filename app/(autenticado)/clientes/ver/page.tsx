import TablaClientes from "@/components/tabla-clientes"
import { Client } from "@/modelos/client"

export default async function VerClientesPage() {
    const clients = await Client.getAll()

    const adaptedClients: Omit<Client, 'save'>[] = clients.map(client => ({
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phoneNumber: client.phoneNumber,
        dni: client.dni,
        deleted: client.deleted
    }))

    return <TablaClientes clientes={adaptedClients} />
}