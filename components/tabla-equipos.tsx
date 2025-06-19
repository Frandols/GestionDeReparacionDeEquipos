'use client'

import { ClienteAdaptado } from "@/respositorios/client"
import { EquipoAdaptado } from "@/respositorios/equipo"
import { MarcaAdaptada } from "@/respositorios/marcas"
import { ModeloAdaptado } from "@/respositorios/modelos"
import { TipoDeEquipoAdaptado } from "@/respositorios/tipoDeEquipo"
import { EllipsisVertical } from "lucide-react"
import { createContext, useContext, useState } from "react"
import EquipoRow from "./equipo-row"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "./ui/table"

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

type ParametrizedFilter = { value: keyof EquipoAdaptado; name: string; }

const filtrosParametrizados: Array<ParametrizedFilter> = [
    {
        value: 'nombreTipoDeEquipo',
        name: 'Tipo de equipo'
    },
    {
        value: 'nombreMarca',
        name: 'Marca'
    },
    {
        value: 'nombreModelo',
        name: 'Modelo'
    },
    {
        value: 'nombreCliente',
        name: 'Cliente'
    },
    {
        value: 'nroSerie',
        name: 'Numero de serie'
    },
] as const

type Filter = typeof filtros[number]

function obtenerEquiposFiltrados(equipos: EquipoAdaptado[], filtro: Exclude<FilterBy, null>) {
    if(filtro.parametrized && filtro.param !== '') return equipos.filter(equipo => {
        const field = equipo[filtro.value]

        if(typeof field === 'string') return field.toLowerCase().startsWith(filtro.param.toLowerCase())
    })

    switch(filtro.value) {
        case 'activos':
            return equipos.filter(equipo => !equipo.deleted)
        case 'eliminados':
            return equipos.filter(equipo => equipo.deleted)
        default:
            return equipos
    }
}

type FilterBy = (Filter & { parametrized: false }) | (ParametrizedFilter & { parametrized: true; param: string }) | null

interface TablaEquiposProps {
    equipos: EquipoAdaptado[]
    showActions: boolean
    clientes: ClienteAdaptado[], 
    tiposDeEquipo: TipoDeEquipoAdaptado[], 
    marcas: MarcaAdaptada[], 
    modelos: ModeloAdaptado[]
}

interface TablaEquiposContextValues {
    clientes: ClienteAdaptado[], 
    tiposDeEquipo: TipoDeEquipoAdaptado[], 
    marcas: MarcaAdaptada[], 
    modelos: ModeloAdaptado[]
    actualizarEquipo: (equipo: EquipoAdaptado) => void
}

const TablaEquiposContext = createContext<TablaEquiposContextValues | null>(null)

export const useTablaEquipos = () => {
    const context = useContext(TablaEquiposContext)

    if (!context) {
        throw new Error("useTablaEquipos deberia ser usado dentro de una tabla de equipos");
    }

    return context
}

export default function TablaEquipos(props: TablaEquiposProps) {
    const [equipos, setEquipos] = useState<EquipoAdaptado[]>(props.equipos)
    const [filterBy, setFilterBy] = useState<FilterBy>(null)

    const equiposFiltrados = filterBy !== null ? obtenerEquiposFiltrados(equipos, filterBy) : equipos

    const actualizarEquipo = (equipoActualizado: EquipoAdaptado) => {
        setEquipos(equipos.map(
            equipo => {
                if(equipo.id === equipoActualizado.id) {
                    return {
                        ...equipo,
                        ...equipoActualizado
                    }
                }

                return equipo
            }
        ))
    }

    return <TablaEquiposContext.Provider value={{
        clientes: props.clientes, 
        tiposDeEquipo: props.tiposDeEquipo, 
        marcas: props.marcas, 
        modelos: props.modelos,
        actualizarEquipo
    }}>
        <div className="flex flex-col gap-2">
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
                <TableCaption>Lista de todos los equipos</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Tipo de equipo</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Modelo</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Observaciones</TableHead>
                        <TableHead>Razon de ingreso</TableHead>
                        <TableHead>Numero de serie</TableHead>
                        <TableHead>Enciende</TableHead>
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
                        equiposFiltrados.map(
                            (equipo) => (
                                <EquipoRow key={equipo.id} equipo={equipo} showActions={props.showActions} />
                            )
                        )
                    }
                </TableBody>
            </Table>
        </div>
    </TablaEquiposContext.Provider>
}