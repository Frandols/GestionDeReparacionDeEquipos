'use client'

import activarUsuario from "@/actions/activarUsuario";
import editarUsuario from "@/actions/editarUsuario";
import eliminarUsuario from "@/actions/eliminarUsuario";
import getCurrentDateForToast from "@/utils/get-current-date-for-toast";
import { useState } from "react";
import { toast } from "sonner";
import FormUsuario from "./form-usuario";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { TableCell, TableRow } from "./ui/table";

export interface UserRowData {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    username: string | null;
    phoneNumber: string;
    DNI: string;
    role: string;
    deleted: boolean;
}

interface UserRowProps {
    row: UserRowData
    onChange: (updatedRow: UserRowData) => void
}

export default function UserRow({ row, onChange }: UserRowProps) {
    const [updating, setUpdating] = useState(false)

    const updateRow = async (updateRegister: () => Promise<void>, action: string, newRow: typeof row) => {
        setUpdating(true)

        await updateRegister()

        setUpdating(false)

        toast(`${row.firstName} ${row.lastName} fue ${action}`, {
            description: getCurrentDateForToast(),
            action: {
                label: "Entendido",
                onClick: () => {}
            },
        })

        onChange(newRow)
    }

    return <TableRow key={row.id} className={updating ? 'opacity-50' : 'opacity-100'}>
        <TableCell className={`font-medium${row.deleted ? ' text-destructive' : ' text-base'}`}>{row.id}</TableCell>
        <TableCell>{row.firstName as string}</TableCell>
        <TableCell>{row.lastName as string}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.username}</TableCell>
        <TableCell>{row.phoneNumber}</TableCell>
        <TableCell>{row.DNI as string}</TableCell>
        <TableCell>{row.role as string}</TableCell>
        <TableCell className={row.deleted ? ' text-destructive' : ' text-green-500'}>{row.deleted ? 'Eliminado' : 'Activo'}</TableCell>
        <TableCell>
            <Dialog>
                <DialogTrigger asChild><Button variant='ghost'>Editar</Button></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Editar usuario</DialogTitle>
                    <DialogDescription>
                        Edita los datos de {row.firstName} {row.lastName} aqui:
                    </DialogDescription>
                    </DialogHeader>
                    <FormUsuario
                        onSubmit={async (values) => {
                            await updateRow(async () => {
                                const message = await editarUsuario(row.id, values)

                                if(message !== undefined) throw new Error(message.code, { cause: message.param })
                            }, 'editado', {
                                ...row,
                                firstName: values.nombre,
                                lastName: values.apellido,
                                email: values.email,
                                username: values.nombreDeUsuario,
                                phoneNumber: values.telefono,
                                DNI: values.DNI,
                                role: values.rol,
                            })
                        }}
                        defaultValues={{
                            nombre: row.firstName as string,
                            apellido: row.lastName as string,
                            email: row.email,
                            nombreDeUsuario: row.username as string,
                            password: '',
                            telefono: row.phoneNumber,
                            DNI: String(row.DNI),
                            rol: row.role
                        }}
                        isPasswordOptional
                    />
                </DialogContent>
            </Dialog>
        </TableCell>
        <TableCell className="text-right">
            {
                row.deleted
                ? <Button onClick={async () => {
                        updateRow(async () => await activarUsuario(row.id), 'activado', {
                            ...row,
                            deleted: false
                        })
                }}>Activar</Button>
                : <Button variant='destructive' onClick={async () => {
                        updateRow(async () => await eliminarUsuario(row.id), 'dado de baja', {
                            ...row,
                            deleted: true
                        })
                }}>Eliminar</Button>
            }
        </TableCell>
    </TableRow>
}