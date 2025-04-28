'use client'

import activarUsuario from "@/app/(autenticado)/usuarios/administrar/actions/activarUsuario";
import eliminarUsuario from "@/app/(autenticado)/usuarios/administrar/actions/eliminarUsuario";
import getCurrentDateForToast from "@/utils/get-current-date-for-toast";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { TableCell, TableRow } from "./ui/table";

export default function UserRow({ user }: { user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    username: string | null;
    phoneNumber: string;
    DNI: string;
    role: string;
    deleted: boolean;
} }) {
    return <TableRow key={user.id}>
        <TableCell className={`font-medium${user.deleted ? ' text-destructive' : ' text-base'}`}>{user.id}</TableCell>
        <TableCell>{user.firstName as string}</TableCell>
        <TableCell>{user.lastName as string}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.username}</TableCell>
        <TableCell>{user.phoneNumber}</TableCell>
        <TableCell>{user.DNI as string}</TableCell>
        <TableCell>{user.role as string}</TableCell>
        <TableCell>{user.deleted ? 'Si' : 'No'}</TableCell>
        <TableCell>
            <Button variant='ghost'>Editar</Button>
        </TableCell>
        <TableCell className="text-right">
            {
                user.deleted
                ? <Button onClick={async () => {
                    await activarUsuario(user.id)
    
                    toast(`${user.firstName} ${user.lastName} fue activado`, {
                        description: getCurrentDateForToast(),
                        action: {
                        label: "Entendido",
                        onClick: () => {}
                        },
                    })
                }}>Activar</Button>
                : <Button variant='destructive' onClick={async () => {
                    await eliminarUsuario(user.id)
    
                    toast(`${user.firstName} ${user.lastName} fue dado de baja`, {
                          description: getCurrentDateForToast(),
                          action: {
                            label: "Entendido",
                            onClick: () => {}
                          },
                        })
                }}>Eliminar</Button>
            }
        </TableCell>
    </TableRow>
}