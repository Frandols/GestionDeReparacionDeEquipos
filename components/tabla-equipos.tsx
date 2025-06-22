'use client'

import { ClienteAdaptado } from "@/respositorios/client"
import { EquipoPayloadRespuesta } from "@/respositorios/equipo"
import { MarcaAdaptada } from "@/respositorios/marcas"
import { MetodoDePagoPayloadRespuesta } from "@/respositorios/metodosDePago"
import { ModeloAdaptado } from "@/respositorios/modelos"
import { TipoDeEquipoAdaptado } from "@/respositorios/tipoDeEquipo"
import { EllipsisVertical } from "lucide-react"
import { createContext, useContext, useState } from "react"
import EquipoRow from "./equipo-row"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Separator } from "./ui/separator"
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

type ParametrizedFilter = { value: keyof EquipoPayloadRespuesta; name: string; }

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

function obtenerEquiposFiltrados(equipos: EquipoPayloadRespuesta[], filtro: Exclude<FilterBy, null>) {
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
    equipos: EquipoPayloadRespuesta[]
    showActions: boolean
    clientes: ClienteAdaptado[], 
    tiposDeEquipo: TipoDeEquipoAdaptado[], 
    marcas: MarcaAdaptada[], 
    modelos: ModeloAdaptado[]
    metodosDePago: MetodoDePagoPayloadRespuesta[]
}

interface TablaEquiposContextValues {
    clientes: ClienteAdaptado[], 
    tiposDeEquipo: TipoDeEquipoAdaptado[], 
    marcas: MarcaAdaptada[], 
    modelos: ModeloAdaptado[]
    metodosDePago: MetodoDePagoPayloadRespuesta[]
    actualizarEquipo: (equipo: EquipoPayloadRespuesta) => void
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
    const [equipos, setEquipos] = useState<EquipoPayloadRespuesta[]>(props.equipos)
    const [filterBy, setFilterBy] = useState<FilterBy>(null)

    const equiposFiltrados = filterBy !== null ? obtenerEquiposFiltrados(equipos, filterBy) : equipos

    const actualizarEquipo = (equipoActualizado: EquipoPayloadRespuesta) => {
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
        metodosDePago: props.metodosDePago,
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
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={filterBy !== null && filterBy.parametrized ?'default' : 'outline'}>
                            <EllipsisVertical/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                        <div className="p-3 flex flex-col gap-2">
                            <p className="font-semibold">Filtrar por:</p>
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
                                <Separator className="mb-3" />
                                <div className="p-3 pt-0 flex flex-col gap-2">
                                    <p className="font-semibold">Buscar {filterBy.name}:</p>
                                    <Input defaultValue={filterBy.param} placeholder={`Escribe aqui...`} onChange={(event) => {
                                        const value = event.target.value

                                        setFilterBy({ ...filterBy, param: value })
                                    }} />
                                </div>
                            </>
                            : null
                        }
                    </PopoverContent>
                </Popover>
            </div>
            <Table>
                <TableCaption>Lista de todos los equipos</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Cliente</TableHead>
                        <TableHead>Tipo de equipo</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Modelo</TableHead>
                        <TableHead>Numero de serie</TableHead>
                        <TableHead>Enciende</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>De baja</TableHead>
                        <TableHead className={props.showActions ? 'text-left' : 'text-right'}>Mas informacion</TableHead>
                        {
                            props.showActions
                            ? <>
                                <TableHead className="text-right">Acciones</TableHead>
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