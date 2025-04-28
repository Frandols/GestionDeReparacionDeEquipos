import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import UserRow from "@/components/user-row";
import { clerkClient } from "@clerk/nextjs/server";

export default async function AdministrarUsuariosPage() {
    const client = await clerkClient()

    const users = await client.users.getUserList()

    const adaptedUsers = users.data.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        username: user.username,
        phoneNumber: user.phoneNumbers[0].phoneNumber,
        DNI: user.publicMetadata.DNI as string,
        role: user.publicMetadata.role as string,
        deleted: user.locked
    }))

    return <Table>
        <TableCaption>Lista de todos los usuarios</TableCaption>
        <TableHeader>
        <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Nombre de usuario</TableHead>
            <TableHead>Telefono</TableHead>
            <TableHead>DNI</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Eliminado</TableHead>
            <TableHead>-</TableHead>
            <TableHead className="text-right">-</TableHead>
        </TableRow>
        </TableHeader>
        <TableBody>
            {
                adaptedUsers.map(
                    user => (
                        <UserRow key={user.id} user={user} />
                    )
                )
            }
        </TableBody>
    </Table>
}