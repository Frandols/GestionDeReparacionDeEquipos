'use client'

import { Table, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { UserRowData } from "./user-row";
import UsersTableBody from "./users-table-body";

const filtros = [
    {
        value: null,
        name: 'Todos'
    },
    {
        value: 'activos',
        name: 'Activos'
    },
    {
        value: 'eliminados',
        name: 'Eliminados'
    }
] as const

type ParametrizedFilter = { value: keyof UserRowData; name: string; oneOf?: { value: string; name: string }[] }

const filtrosParametrizados: Array<ParametrizedFilter> = [
    {
        value: 'firstName',
        name: 'Nombre'
    },
    {
        value: 'lastName',
        name: 'Apellido'
    },
    {
        value: 'email',
        name: 'Email'
    },
    {
        value: 'username',
        name: 'Nombre de usuario'
    },
    {
        value: 'phoneNumber',
        name: 'Telefono'
    },
    {
        value: 'DNI',
        name: 'DNI'
    },
    {
        value: 'role',
        name: 'Rol',
        oneOf: [
            {
                value: 'maestro',
                name: 'Maestro'
            },
            {
                value: 'administrador',
                name: 'Administrador'
            }, 
            {
                value: 'tecnico',
                name: 'Tecnico'
            }
        ]
    }
] as const

type Filter = typeof filtros[number]

function obtenerUsuariosFiltrados(usuarios: UserRowData[], filtro: Exclude<FilterBy, null>) {
    if(filtro.parametrized && filtro.param !== '') return usuarios.filter(usuario => {
        const field = usuario[filtro.value]

        if(typeof field === 'string') return field.toLowerCase().startsWith(filtro.param.toLowerCase())
    })

    switch(filtro.value) {
        case 'activos':
            return usuarios.filter(usuario => !usuario.deleted)
        case 'eliminados':
            return usuarios.filter(usuario => usuario.deleted)
        default:
            return usuarios
    }
}

type FilterBy = (Filter & { parametrized: false }) | (ParametrizedFilter & { parametrized: true; param: string }) | null

export default function TablaUsuarios(props: { users: UserRowData[] }) {
    const [currentUsers, setCurrentUsers] = useState<typeof props.users>(props.users)

    const updateUser = async (id: number, row: (typeof props.users)[number]) => {
        setCurrentUsers(currentUsers.map(
            (currentUser, currentUserId) => {
                if(currentUserId === id) return row

                return currentUser
            }
        ))
    }

    const [filterBy, setFilterBy] = useState<FilterBy>(null)

    const users = filterBy !== null ? obtenerUsuariosFiltrados(currentUsers, filterBy) : currentUsers

    return <div className='flex flex-col'>
        <div className='flex gap-2'>
            {
                filtros.map(
                    filtro => <Button key={filtro.value} onClick={
                        () => setFilterBy(filterBy?.value === filtro.value ? null : { ...filtro, parametrized: false })
                    } 
                    variant={(filterBy?.value || null) === filtro.value ? 'default' : 'outline'}>{filtro.name}</Button>
                )
            }
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={filterBy !== null && filterBy.parametrized ?'default' : 'outline'}>
                        <EllipsisVertical/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="right">
                    <DropdownMenuLabel>Filtrar por:</DropdownMenuLabel>
                    <div className="p-1">
                        <Select defaultValue={filterBy?.parametrized ? filterBy.value : ''} onValueChange={filterValue => {
                            const filter = filtrosParametrizados.find(filtro => filtro.value === filterValue) as ParametrizedFilter

                            setFilterBy({ ...filter, parametrized: true, param: '' })
                        }}>
                            <SelectTrigger className="w-full min-w-[180px]">
                                <SelectValue placeholder="Elige uno..." />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    filtrosParametrizados.map(
                                        filtro => <SelectItem key={filtro.value} value={filtro.value}>{filtro.name}</SelectItem>
                                    )
                                }
                            </SelectContent>
                        </Select>
                    </div>
                    {
                        filterBy !== null && filterBy.parametrized
                        ? <>
                            <DropdownMenuSeparator />
                            <div className="p-1">
                                <DropdownMenuLabel>Buscar:</DropdownMenuLabel>
                                {
                                    filterBy.oneOf
                                    ? <Select onValueChange={(value) => {
                                        setFilterBy({ ...filterBy, param: value })
                                    }}>
                                        <SelectTrigger className="w-full min-w-[180px]">
                                            <SelectValue placeholder="Elige uno..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                filterBy.oneOf.map(
                                                    option => <SelectItem key={option.value} value={option.value}>{option.name}</SelectItem>
                                                )
                                            }
                                        </SelectContent>
                                    </Select>
                                    : <Input defaultValue={filterBy.param} placeholder={`${filterBy.name}...`} onChange={(event) => {
                                        const value = event.target.value
    
                                        setFilterBy({ ...filterBy, param: value })
                                    }} />
                                }
                                <p className="text-sm text-muted-foreground mt-1">Ingresa el valor que deseas buscar</p>
                            </div>
                        </>
                        : null
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <Table>
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
                <TableHead>Estado</TableHead>
                <TableHead>-</TableHead>
                <TableHead className="text-right">-</TableHead>
            </TableRow>
            </TableHeader>
            <UsersTableBody rows={users} onChangeRow={updateUser} />
        </Table>
    </div>
}