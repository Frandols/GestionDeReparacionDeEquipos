'use client'

import { Client } from "@/modelos/client"
import { EllipsisVertical } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

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

type ParametrizedFilter = { value: keyof Omit<Client, 'save'>; name: string; }

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
        value: 'phoneNumber',
        name: 'Telefono'
    },
    {
        value: 'dni',
        name: 'DNI'
    },
] as const

type Filter = typeof filtros[number]

function obtenerClientesFiltrados(clientes: Omit<Client, 'save'>[], filtro: Exclude<FilterBy, null>) {
    if(filtro.parametrized && filtro.param !== '') return clientes.filter(usuario => {
        const field = usuario[filtro.value]

        if(typeof field === 'string') return field.toLowerCase().startsWith(filtro.param.toLowerCase())
    })

    switch(filtro.value) {
        case 'activos':
            return clientes.filter(usuario => !usuario.deleted)
        case 'eliminados':
            return clientes.filter(usuario => usuario.deleted)
        default:
            return clientes
    }
}

type FilterBy = (Filter & { parametrized: false }) | (ParametrizedFilter & { parametrized: true; param: string }) | null

interface TablaClientesCoreProps {
    clientes: Omit<Client, 'save'>[]
}

interface TablaClientesConAccionesProps extends TablaClientesCoreProps {
    showActions: true
    onUpdate: (cliente: Omit<Client, 'save'>) => void
    onDelete: (cliente: Omit<Client, 'save'>) => void
    onActivate: (cliente: Omit<Client, 'save'>) => void
}

interface TablaClientesSinAccionesProps extends TablaClientesCoreProps {
    showActions: false
}

type TablaClientesProps = TablaClientesConAccionesProps | TablaClientesSinAccionesProps

export default function TablaClientes(props: TablaClientesProps) {
    const [filterBy, setFilterBy] = useState<FilterBy>(null)

    const clientes = filterBy !== null ? obtenerClientesFiltrados(props.clientes, filterBy) : props.clientes

    return <div className="flex flex-col gap-2">
        <div className='flex gap-2'>
            {
                filtros.map(
                    filtro => <Button key={filtro.value} onClick={
                        () => setFilterBy(filterBy?.value === filtro.value ? null : { ...filtro, parametrized: false })
                    } 
                    variant={((filterBy?.value || null) === filtro.value) ? 'default' : 'outline'}>{filtro.name}</Button>
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
                                <Input defaultValue={filterBy.param} placeholder={`${filterBy.name}...`} onChange={(event) => {
                                    const value = event.target.value

                                    setFilterBy({ ...filterBy, param: value })
                                }} />
                                <p className="text-sm text-muted-foreground mt-1">Ingresa el valor que deseas buscar</p>
                            </div>
                        </>
                        : null
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <Table>
            <TableCaption>Lista de todos los clientes</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellido</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefono</TableHead>
                    <TableHead>DNI</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                    {
                        props.showActions
                        ? <>
                            <TableHead className="text-right">-</TableHead>
                            <TableHead className="text-right">-</TableHead>
                        </>
                        : null
                    }
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    clientes.map(
                        (cliente) => (
                            <TableRow key={cliente.id}>
                                <TableCell className={`font-medium${cliente.deleted ? ' text-destructive' : ' text-base'}`}>{cliente.id}</TableCell>
                                <TableCell>{cliente.firstName as string}</TableCell>
                                <TableCell>{cliente.lastName as string}</TableCell>
                                <TableCell>{cliente.email}</TableCell>
                                <TableCell>{cliente.phoneNumber}</TableCell>
                                <TableCell>{cliente.dni as string}</TableCell>
                                <TableCell className={`text-right${cliente.deleted ? ' text-destructive' : ' text-green-500'}`}>{cliente.deleted ? 'Eliminado' : 'Activo'}</TableCell>
                                {
                                    props.showActions
                                    ? <>
                                        <TableCell className="text-right">
                                            <Button variant='ghost' onClick={() => {
                                                props.onUpdate(cliente)
                                            }}>Editar</Button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {
                                                cliente.deleted
                                                ? <Button onClick={() => {
                                                    props.onActivate(cliente)
                                                }}>Activar</Button>
                                                : <Button variant='destructive' onClick={() => {
                                                    props.onDelete(cliente)
                                                }}>Eliminar</Button>
                                            }
                                        </TableCell>
                                    </>
                                    : null
                                }
                            </TableRow>
                        )
                    )
                }
            </TableBody>
        </Table>
    </div>
}